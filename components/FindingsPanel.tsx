"use client";

import { useState } from "react";
import type { Finding, FindingSeverity } from "@/types";

const SEVERITY_CONFIG: Record<FindingSeverity, { label: string; color: string; bg: string; border: string; dot: string }> = {
  critical: { label: "Critical", color: "text-[#f85149]", bg: "bg-[#2d0f0f]", border: "border-[#6b1a1a]", dot: "bg-[#f85149]" },
  high:     { label: "High",     color: "text-[#ff7b72]", bg: "bg-[#2d1b0f]", border: "border-[#6b3a1a]", dot: "bg-[#ff7b72]" },
  medium:   { label: "Medium",   color: "text-[#e3b341]", bg: "bg-[#2d2500]", border: "border-[#6b5200]", dot: "bg-[#e3b341]" },
  low:      { label: "Low",      color: "text-[#58a6ff]", bg: "bg-[#1a2634]", border: "border-[#1f4a7a]", dot: "bg-[#58a6ff]" },
  info:     { label: "Info",     color: "text-[#8b949e]", bg: "bg-[#21262d]", border: "border-[#30363d]", dot: "bg-[#8b949e]" },
};

const EVIDENCE_TYPE_LABEL: Record<string, string> = {
  code: "Code reference",
  caller: "Caller context",
  test: "Test coverage",
  config: "Config impact",
  dependency: "Dependency chain",
};

interface FindingCardProps {
  finding: Finding;
}

function FindingCard({ finding }: FindingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[finding.severity];

  return (
    <div className={`finding-enter border rounded-xl overflow-hidden ${cfg.border}`}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-[#161b22] transition-colors"
      >
        <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
              {cfg.label}
            </span>
            <span className="text-xs text-[#8b949e] font-medium">{finding.agentName}</span>
          </div>
          <p className="text-sm font-semibold text-[#e6edf3] mt-1 leading-snug">{finding.title}</p>
          <p className="text-xs text-[#8b949e] font-mono mt-0.5 truncate">
            {finding.file}{finding.line ? `:${finding.line}` : ""}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-[#8b949e] shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 16 16" fill="currentColor"
        >
          <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z" />
        </svg>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[#21262d]">
          <p className="text-sm text-[#8b949e] leading-relaxed pt-3">{finding.description}</p>

          {/* Evidence block */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#58a6ff]" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 1.75C0 .784.784 0 1.75 0h7.586c.464 0 .909.184 1.237.513l5.164 5.163c.329.328.513.773.513 1.237v7.586A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V8.5h-4.25A1.75 1.75 0 0 1 8.5 6.75V2.5H1.75Zm6.25.062V6.75c0 .138.112.25.25.25h4.688Z" />
              </svg>
              <span className="text-[11px] font-semibold text-[#58a6ff]">
                {EVIDENCE_TYPE_LABEL[finding.evidenceType]}
              </span>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-3 overflow-x-auto">
              <code className="code-evidence text-[#e6edf3]">{finding.evidence}</code>
            </div>
          </div>

          {/* Remediation */}
          {finding.remediation && (
            <div className="flex gap-2 bg-[#0d2114] border border-[#238636] rounded-md p-3">
              <svg className="w-4 h-4 text-[#3fb950] shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm9 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-6.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0Z" />
              </svg>
              <p className="text-xs text-[#3fb950] leading-relaxed">{finding.remediation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const FILTER_OPTIONS: { label: string; value: FindingSeverity | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
  { label: "Info", value: "info" },
];

interface FindingsPanelProps {
  findings: Finding[];
}

export default function FindingsPanel({ findings }: FindingsPanelProps) {
  const [filter, setFilter] = useState<FindingSeverity | "all">("all");

  const filtered = filter === "all" ? findings : findings.filter((f) => f.severity === filter);

  const counts: Record<FindingSeverity, number> = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high:     findings.filter((f) => f.severity === "high").length,
    medium:   findings.filter((f) => f.severity === "medium").length,
    low:      findings.filter((f) => f.severity === "low").length,
    info:     findings.filter((f) => f.severity === "info").length,
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header + severity counts */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[#e6edf3]">
          Findings
          <span className="ml-2 text-xs text-[#8b949e] font-normal">{findings.length} total</span>
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          {(["critical", "high", "medium"] as FindingSeverity[]).map((s) =>
            counts[s] > 0 ? (
              <span key={s} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${SEVERITY_CONFIG[s].bg} ${SEVERITY_CONFIG[s].color}`}>
                {counts[s]} {SEVERITY_CONFIG[s].label}
              </span>
            ) : null
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#161b22] border border-[#30363d] rounded-xl p-1 w-fit">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filter === opt.value
                ? "bg-[#7c5cd8] text-white"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            {opt.label}
            {opt.value !== "all" && counts[opt.value] > 0 && (
              <span className="ml-1 opacity-70">({counts[opt.value]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Findings list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg className="w-8 h-8 text-[#3fb950] mb-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
          </svg>
          <p className="text-sm text-[#8b949e]">No findings for this filter</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </div>
      )}

      {/* Limitation note */}
      {findings.length > 0 && (
        <div className="flex gap-2 bg-[#161b22] border border-[#30363d] rounded-md p-3 mt-1">
          <svg className="w-4 h-4 text-[#8b949e] shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm9 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-6.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0Z" />
          </svg>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            All findings are evidence-backed with direct code references. Agents only access repository context
            relevant to the changed files. Limitations: dynamic runtime behaviour and environment-specific
            configuration are outside the review scope.
          </p>
        </div>
      )}
    </div>
  );
}
