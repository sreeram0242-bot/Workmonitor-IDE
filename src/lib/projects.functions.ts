import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/lib/prisma";
import { broadcast } from "@/lib/ably.functions";

async function getAuthOrThrow() {
  const authResult = await auth();
  if (!authResult.userId) throw new Error("Unauthorized");
  return authResult;
}

async function requireAdmin() {
  const authResult = await getAuthOrThrow();
  const roleRecord = await prisma.userRole.findFirst({
    where: { user_id: authResult.userId },
  });
  if (!roleRecord || roleRecord.role !== "admin") {
    throw new Error("Admin permissions required");
  }
  return authResult;
}

export const fetchProjects = createServerFn({ method: "GET" }).handler(async () => {
  await getAuthOrThrow();
  const projects = await prisma.project.findMany({
    orderBy: { created_at: "desc" },
    include: {
      stages: {
        orderBy: { position: "asc" },
      },
    },
  });
  return projects;
});

export const createProject = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      description?: string | null;
      client_name?: string | null;
      stages?: { title: string; subtitle?: string | null; description?: string | null }[];
    }) => data,
  )
  .handler(async ({ data: { name, description, client_name, stages } }) => {
    const authResult = await requireAdmin();

    const defaultStages = stages && stages.length > 0 ? stages : [
      { title: "Project Initiated", subtitle: "Kickoff & Planning", description: "Initial setup & scope alignment" },
      { title: "Design & Specs", subtitle: "Wireframes & Review", description: "Architecture and design approval" },
      { title: "Development", subtitle: "Active Build Phase", description: "Core feature engineering & integration" },
      { title: "Testing & QA", subtitle: "Validation & Bug Fixes", description: "Quality assurance and testing" },
      { title: "Final Delivery", subtitle: "Launch & Handover", description: "Deployment and final client delivery" },
    ];

    const project = await prisma.project.create({
      data: {
        name,
        description: description ?? null,
        client_name: client_name ?? null,
        created_by: authResult.userId,
        current_stage_index: 0,
      },
    });

    await prisma.projectStage.createMany({
      data: defaultStages.map((s, idx) => ({
        project_id: project.id,
        title: s.title,
        subtitle: s.subtitle ?? null,
        description: s.description ?? null,
        position: idx,
        is_completed: idx === 0,
        completed_at: idx === 0 ? new Date() : null,
      })),
    });

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        stages: {
          orderBy: { position: "asc" },
        },
      },
    });

    await broadcast("projects", "project-updates", { type: "project_created", projectId: project.id });
    return fullProject;
  });

export const updateProject = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      name?: string;
      description?: string | null;
      client_name?: string | null;
      status?: string;
    }) => data,
  )
  .handler(async ({ data: { id, ...updates } }) => {
    await requireAdmin();
    const updated = await prisma.project.update({
      where: { id },
      data: updates,
      include: {
        stages: {
          orderBy: { position: "asc" },
        },
      },
    });

    await broadcast("projects", "project-updates", { type: "project_updated", projectId: id });
    return updated;
  });

export const deleteProject = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAdmin();
    await prisma.project.delete({ where: { id } });
    await broadcast("projects", "project-updates", { type: "project_deleted", projectId: id });
    return true;
  });

export const setCurrentStage = createServerFn({ method: "POST" })
  .validator((data: { projectId: string; stageIndex: number }) => data)
  .handler(async ({ data: { projectId, stageIndex } }) => {
    await requireAdmin();

    const stages = await prisma.projectStage.findMany({
      where: { project_id: projectId },
      orderBy: { position: "asc" },
    });

    const targetStageId = stages[stageIndex]?.id;

    // Bulk update completed stages <= stageIndex in 1 query
    if (stageIndex >= 0 && stages.length > 0) {
      const completedStageIds = stages.slice(0, stageIndex + 1).map((s) => s.id);
      const upcomingStageIds = stages.slice(stageIndex + 1).map((s) => s.id);

      await Promise.all([
        completedStageIds.length > 0
          ? prisma.projectStage.updateMany({
              where: { id: { in: completedStageIds } },
              data: { is_completed: true },
            })
          : Promise.resolve(),
        upcomingStageIds.length > 0
          ? prisma.projectStage.updateMany({
              where: { id: { in: upcomingStageIds } },
              data: { is_completed: false, completed_at: null },
            })
          : Promise.resolve(),
      ]);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        current_stage_index: stageIndex,
        status: stageIndex >= stages.length - 1 ? "completed" : "in_progress",
      },
      include: {
        stages: {
          orderBy: { position: "asc" },
        },
      },
    });

    broadcast("projects", "project-updates", {
      type: "stage_changed",
      projectId,
      stageIndex,
    }).catch(() => {});

    return updatedProject;
  });

export const addProjectStage = createServerFn({ method: "POST" })
  .validator(
    (data: {
      projectId: string;
      title: string;
      subtitle?: string | null;
      description?: string | null;
      status_note?: string | null;
    }) => data,
  )
  .handler(async ({ data: { projectId, title, subtitle, description, status_note } }) => {
    await requireAdmin();
    const count = await prisma.projectStage.count({ where: { project_id: projectId } });

    await prisma.projectStage.create({
      data: {
        project_id: projectId,
        title,
        subtitle: subtitle ?? null,
        description: description ?? null,
        status_note: status_note ?? null,
        position: count,
        is_completed: false,
      },
    });

    await broadcast("projects", "project-updates", { type: "stage_added", projectId });
    return true;
  });

export const updateProjectStage = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      title?: string;
      subtitle?: string | null;
      description?: string | null;
      status_note?: string | null;
      completed_at?: Date | string | null;
    }) => data,
  )
  .handler(async ({ data: { id, ...updates } }) => {
    await requireAdmin();
    const updated = await prisma.projectStage.update({
      where: { id },
      data: updates,
    });

    await broadcast("projects", "project-updates", { type: "stage_updated", stageId: id });
    return updated;
  });

export const deleteProjectStage = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAdmin();
    const stage = await prisma.projectStage.findUnique({ where: { id } });
    if (!stage) return true;
    await prisma.projectStage.delete({ where: { id } });
    await broadcast("projects", "project-updates", {
      type: "stage_deleted",
      projectId: stage.project_id,
    });
    return true;
  });

export const reorderProjectStages = createServerFn({ method: "POST" })
  .validator((data: { projectId: string; stageIds: string[] }) => data)
  .handler(async ({ data: { projectId, stageIds } }) => {
    await requireAdmin();
    await Promise.all(
      stageIds.map((id, index) =>
        prisma.projectStage.update({
          where: { id },
          data: { position: index },
        }),
      ),
    );
    await broadcast("projects", "project-updates", { type: "stage_reordered", projectId });
    return true;
  });
