"use client";

import type { ReviewStatus } from "@/types";

interface ReviewProgressProps {
  status: ReviewStatus;
}

const STEPS: { key: ReviewStatus; label: string }[] = [
  { key: "loading_context", label: "Retrieving repo context" },
  { key: "activating_agents", label: "Activating specialised agents" },
  { key: "reviewing", label: "Agents reviewing changes" },
  { key: "verifying", label: "Verifying findings with repo tooling" },
  { key: "done", label: "Review complete" },
];

const ORDER: ReviewStatus[] = ["idle", "loading_context", "activating_agents", "reviewing", "verifying", "done"];

export default function ReviewProgress({ status }: ReviewProgressProps) {
  if (status === "idle") return null;

  const currentIdx = ORDER.indexOf(status);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
      <p className="text-xs font-semibold text-[#8b949e] uppercase tracking-widest mb-4">Review Pipeline</p>
      <ol className="flex flex-col gap-3">
        {STEPS.map((step, i) => {
          const stepIdx = ORDER.indexOf(step.key);
          const isDone = stepIdx < currentIdx;
          const isActive = step.key === status;
          const isPending = stepIdx > currentIdx;

          return (
            <li key={step.key} className="flex items-center gap-3">
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                isDone ? "bg-[#3fb950] text-[#0d1117] shadow-lg shadow-[#3fb950]/20" :
                isActive ? "bg-[#7c5cd8] text-white agent-pulse shadow-lg shadow-[#7c5cd8]/30" :
                "bg-[#21262d] text-[#484f58]"
              }`}>
                {isDone ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>

              {/* Label */}
              <span className={`text-sm flex-1 ${
                isDone ? "text-[#8b949e] line-through" :
                isActive ? "text-[#e6edf3] font-medium" :
                "text-[#484f58]"
              }`}>
                {step.label}
              </span>

              {/* Spinner */}
              {isActive && (
                <svg className="w-4 h-4 text-[#7c5cd8] animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              )}
            </li>
          );
        })}
      </ol>

      {/* Progress bar */}
      {status !== "done" && (
        <div className="mt-4 h-1.5 bg-[#21262d] rounded-full overflow-hidden">
          <div className="h-full shimmer rounded-full transition-all duration-500" style={{ width: `${(currentIdx / (ORDER.length - 1)) * 100}%` }} />
        </div>
      )}
    </div>
  );
}
