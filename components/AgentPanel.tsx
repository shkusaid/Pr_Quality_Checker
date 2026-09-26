"use client";

import type { Agent, AgentStatus } from "@/types";

const STATUS_COLORS: Record<AgentStatus, string> = {
  idle: "text-[#484f58] bg-[#21262d]",
  activating: "text-[#e3b341] bg-[#2d2500]",
  running: "text-[#58a6ff] bg-[#1a2634]",
  done: "text-[#3fb950] bg-[#0d2114]",
  skipped: "text-[#484f58] bg-[#21262d]",
};

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: "Idle",
  activating: "Activating",
  running: "Running",
  done: "Done",
  skipped: "Skipped",
};

const STATUS_DOT: Record<AgentStatus, string> = {
  idle: "bg-[#484f58]",
  activating: "bg-[#e3b341] agent-pulse",
  running: "bg-[#58a6ff] agent-pulse",
  done: "bg-[#3fb950]",
  skipped: "bg-[#484f58]",
};

const ICON_MAP: Record<string, JSX.Element> = {
  security: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M7.467.133a1.748 1.748 0 0 1 1.066 0l5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.648 3.26-1.628 4.674A12.53 12.53 0 0 1 8.108 15.73a2 2 0 0 1-1.116 0C4.107 15.21 1 11.75 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667ZM8.787 1.574a.25.25 0 0 0-.152 0l-5.25 1.68A.25.25 0 0 0 3.167 3.48v3.52c0 2.803 1.764 5.068 4.528 5.985a.25.25 0 0 0 .155 0C10.607 12.07 12.833 9.64 12.833 7V3.48a.25.25 0 0 0-.174-.238Z" />
    </svg>
  ),
  performance: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" />
    </svg>
  ),
  style: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 1.75C0 .784.784 0 1.75 0h7.586c.464 0 .909.184 1.237.513l5.164 5.163c.329.328.513.773.513 1.237v7.586A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V8.5h-4.25A1.75 1.75 0 0 1 8.5 6.75V2.5H1.75Zm6.25.062V6.75c0 .138.112.25.25.25h4.688Z" />
    </svg>
  ),
  test: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z" />
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z" />
    </svg>
  ),
  dependency: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8.878.392a1.75 1.75 0 0 0-1.756 0l-5.25 3.045A1.75 1.75 0 0 0 1 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 0 0 1.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514ZM7.875 1.69a.25.25 0 0 1 .25 0l4.63 2.685L8 7.133 3.245 4.375ZM2.5 5.677v5.372c0 .089.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z" />
    </svg>
  ),
  context: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 .278a.749.749 0 0 1 0 1.06L1.81 5.52l4.19 4.182a.749.749 0 1 1-1.06 1.06l-4.75-4.75a.749.749 0 0 1 0-1.06L4.94.279A.749.749 0 0 1 6 .278ZM10 .278a.749.749 0 0 1 1.06 0l4.75 4.75a.749.749 0 0 1 0 1.06l-4.75 4.75a.749.749 0 1 1-1.06-1.06l4.19-4.182-4.19-4.182a.749.749 0 0 1 0-1.06Z" />
    </svg>
  ),
};

interface AgentCardProps {
  agent: Agent;
}

function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className={`bg-[#161b22] border rounded-xl p-4 flex flex-col gap-3 transition-all ${
      agent.status === "running" ? "border-[#1f6feb] shadow-[0_0_10px_rgba(31,111,235,0.15)]" :
      agent.status === "done" ? "border-[#238636]" :
      agent.status === "activating" ? "border-[#9e6a03]" :
      "border-[#30363d]"
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${STATUS_COLORS[agent.status]}`}>
            {ICON_MAP[agent.icon]}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#e6edf3]">{agent.name}</p>
            <p className="text-[11px] text-[#8b949e]">{agent.role}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[agent.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[agent.status]}`} />
          {STATUS_LABELS[agent.status]}
        </span>
      </div>

      <p className="text-xs text-[#8b949e] leading-relaxed">{agent.description}</p>

      {agent.status === "done" && agent.findingsCount !== undefined && (
        <div className="flex items-center gap-2 pt-1 border-t border-[#21262d]">
          <svg className="w-3.5 h-3.5 text-[#8b949e]" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.22 1.754a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-5.25a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0Z" />
          </svg>
          <span className="text-xs text-[#8b949e]">
            {agent.findingsCount === 0
              ? "No issues found"
              : `${agent.findingsCount} finding${agent.findingsCount > 1 ? "s" : ""}`}
          </span>
        </div>
      )}

      {agent.status === "running" && (
        <div className="h-0.5 bg-[#21262d] rounded-full overflow-hidden">
          <div className="h-full shimmer rounded-full w-2/3" />
        </div>
      )}

      {agent.status === "skipped" && (
        <p className="text-[11px] text-[#484f58] italic">No relevant changes detected — agent skipped.</p>
      )}
    </div>
  );
}

interface AgentPanelProps {
  agents: Agent[];
}

export default function AgentPanel({ agents }: AgentPanelProps) {
  const activeCount = agents.filter((a) => a.status === "running" || a.status === "activating").length;
  const doneCount = agents.filter((a) => a.status === "done").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#e6edf3]">Specialised Agents</h2>
          {activeCount > 0 && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#58a6ff] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] agent-pulse" />
              {activeCount} active
            </span>
          )}
        </div>
        <span className="text-xs text-[#8b949e]">{doneCount}/{agents.length} complete</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
