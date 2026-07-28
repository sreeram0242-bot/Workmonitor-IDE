import React from "react";
import {
  Check,
  Clock,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Edit3,
  Trash2,
  Plus,
  Sparkles,
  AlertCircle,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type ProjectRow, type ProjectStageRow } from "@/lib/projects";

interface ProjectFlowTimelineProps {
  project: ProjectRow;
  isAdmin?: boolean;
  onSetCurrentStage?: (projectId: string, stageIndex: number) => void;
  onEditStage?: (stage: ProjectStageRow) => void;
  onDeleteStage?: (stageId: string) => void;
  onAddStage?: (projectId: string) => void;
  onReorderStage?: (projectId: string, fromIndex: number, toIndex: number) => void;
}

export function ProjectFlowTimeline({
  project,
  isAdmin,
  onSetCurrentStage,
  onEditStage,
  onDeleteStage,
  onAddStage,
  onReorderStage,
}: ProjectFlowTimelineProps) {
  const stages = project.stages || [];
  const currentIdx = project.current_stage_index ?? 0;

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-indigo-500/5 to-sky-500/10 p-5 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              {project.status === "completed" ? "Project Complete" : "Active Tracking Flow"}
            </span>
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-700 font-semibold">
              Stage {Math.min(currentIdx + 1, stages.length)} of {stages.length}
            </Badge>
          </div>
          <h2 className="mt-1 font-display text-xl font-bold text-slate-900">
            {stages[currentIdx]?.title || "In Progress"}
          </h2>
          {stages[currentIdx]?.subtitle && (
            <p className="text-sm font-medium text-blue-800 mt-0.5">
              {stages[currentIdx].subtitle}
            </p>
          )}
        </div>

        {isAdmin && onSetCurrentStage && stages.length > 0 && (
          <div className="flex items-center gap-2">
            {currentIdx < stages.length - 1 && (
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all hover:scale-[1.02]"
                onClick={() => onSetCurrentStage(project.id, currentIdx + 1)}
              >
                Advance to Next Stage <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
            {onAddStage && (
              <Button size="sm" variant="outline" onClick={() => onAddStage(project.id)} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Plus className="mr-1 h-4 w-4" /> Add Flow Step
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Amazon-Style Vertical Timeline */}
      <div className="relative pl-3 pr-2 py-4">
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIdx || (idx === currentIdx && stage.is_completed);
          const isCurrent = idx === currentIdx;
          const isLast = idx === stages.length - 1;

          return (
            <div key={stage.id} className="relative flex items-start gap-4 pb-8 group">
              {/* Vertical connecting line */}
              {!isLast && (
                <div
                  className={`absolute left-[17px] top-[36px] bottom-0 w-1 transition-all duration-500 ${
                    idx < currentIdx
                      ? "bg-blue-600 shadow-sm"
                      : idx === currentIdx
                        ? "bg-gradient-to-b from-blue-600 to-slate-200"
                        : "bg-slate-200"
                  }`}
                />
              )}

              {/* Node Icon Box */}
              <div className="relative z-10 shrink-0">
                {isCompleted ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-4 ring-white">
                    <Check className="h-5 w-5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 animate-pulse">
                    <Sparkles className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-slate-400 ring-4 ring-white">
                    <div className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                  </div>
                )}
              </div>

              {/* Stage Details Content */}
              <div
                className={`min-w-0 flex-1 rounded-2xl border p-4 transition-all duration-200 ${
                  isCurrent
                    ? "border-blue-500/40 bg-white shadow-lg ring-1 ring-blue-500/20"
                    : isCompleted
                      ? "border-slate-200/80 bg-slate-50/60"
                      : "border-slate-200/70 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`font-display text-base ${
                          isCurrent
                            ? "font-bold text-slate-900"
                            : isCompleted
                              ? "font-semibold text-slate-800"
                              : "font-semibold text-slate-700"
                        }`}
                      >
                        {stage.title}
                      </h3>

                      {isCurrent && (
                        <Badge className="bg-blue-600 text-white hover:bg-blue-600 font-bold uppercase tracking-wider text-[10px]">
                          Current Stage
                        </Badge>
                      )}
                    </div>

                    {stage.subtitle && (
                      <p
                        className={`text-sm ${
                          isCurrent
                            ? "font-semibold text-blue-700 mt-0.5"
                            : "text-slate-600 mt-0.5"
                        }`}
                      >
                        {stage.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Actions for Admin */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onReorderStage && stages.length > 1 && (
                        <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={idx === 0}
                            className="h-6 w-6 p-0 text-slate-700 hover:text-blue-700 hover:bg-white rounded disabled:opacity-25"
                            onClick={() => onReorderStage(project.id, idx, idx - 1)}
                            title="Move Stage Up"
                          >
                            <ChevronUp className="h-3.5 w-3.5 stroke-[2.5]" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={idx === stages.length - 1}
                            className="h-6 w-6 p-0 text-slate-700 hover:text-blue-700 hover:bg-white rounded disabled:opacity-25"
                            onClick={() => onReorderStage(project.id, idx, idx + 1)}
                            title="Move Stage Down"
                          >
                            <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
                          </Button>
                        </div>
                      )}
                      {!isCurrent && onSetCurrentStage && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2.5 text-xs text-blue-700 hover:bg-blue-50 font-bold border border-blue-200/60 rounded-lg"
                          onClick={() => onSetCurrentStage(project.id, idx)}
                          title="Set as Current Stage"
                        >
                          Set Current
                        </Button>
                      )}
                      {onEditStage && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                          onClick={() => onEditStage(stage)}
                          title="Edit Stage Text & Timestamp"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onDeleteStage && stages.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDeleteStage(stage.id)}
                          title="Delete Stage"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {stage.description && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {stage.description}
                  </p>
                )}

                {stage.status_note && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-900">
                    <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-blue-700 block">
                        Stage Note / Update:
                      </span>
                      {stage.status_note}
                    </div>
                  </div>
                )}

                {stage.completed_at && isCompleted && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-blue-600" /> Completed:{" "}
                    {new Date(stage.completed_at).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
