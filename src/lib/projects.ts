import {
  fetchProjects as serverFetchProjects,
  createProject as serverCreateProject,
  updateProject as serverUpdateProject,
  deleteProject as serverDeleteProject,
  setCurrentStage as serverSetCurrentStage,
  addProjectStage as serverAddProjectStage,
  updateProjectStage as serverUpdateProjectStage,
  deleteProjectStage as serverDeleteProjectStage,
} from "./projects.functions";

export interface ProjectStageRow {
  id: string;
  project_id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  status_note: string | null;
  position: number;
  is_completed: boolean;
  completed_at: string | Date | null;
  created_at: string | Date;
}

export interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  client_name: string | null;
  status: "planning" | "in_progress" | "completed" | "on_hold" | string;
  created_by: string;
  current_stage_index: number;
  created_at: string | Date;
  updated_at: string | Date;
  stages: ProjectStageRow[];
}

let _projectsCache: ProjectRow[] | null = null;

export function getCachedProjects(): ProjectRow[] | null {
  return _projectsCache;
}

export async function fetchProjects(): Promise<ProjectRow[]> {
  const list = await serverFetchProjects();
  _projectsCache = list as any[];
  return _projectsCache;
}

export async function createProject(params: {
  name: string;
  description?: string | null;
  client_name?: string | null;
  stages?: { title: string; subtitle?: string | null; description?: string | null }[];
}): Promise<ProjectRow> {
  const p = await serverCreateProject({ data: params });
  return p as any;
}

export async function updateProject(id: string, updates: Partial<ProjectRow>): Promise<ProjectRow> {
  const p = await serverUpdateProject({ data: { id, ...updates } });
  return p as any;
}

export async function deleteProject(id: string): Promise<boolean> {
  return await serverDeleteProject({ data: id });
}

export async function setCurrentStage(projectId: string, stageIndex: number): Promise<ProjectRow> {
  const p = await serverSetCurrentStage({ data: { projectId, stageIndex } });
  return p as any;
}

export async function addProjectStage(params: {
  projectId: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  status_note?: string | null;
}): Promise<boolean> {
  return await serverAddProjectStage({ data: params });
}

export async function updateProjectStage(
  id: string,
  updates: Partial<ProjectStageRow>,
): Promise<ProjectStageRow> {
  const s = await serverUpdateProjectStage({ data: { id, ...updates } });
  return s as any;
}

export async function deleteProjectStage(id: string): Promise<boolean> {
  return await serverDeleteProjectStage({ data: id });
}
