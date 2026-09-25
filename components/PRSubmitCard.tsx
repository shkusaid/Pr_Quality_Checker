"use client";

import { useState } from "react";
import type { PRInfo } from "@/types";

interface PRSubmitCardProps {
  onSubmit: (pr: PRInfo) => void;
  isLoading: boolean;
}

export default function PRSubmitCard({ onSubmit, isLoading }: PRSubmitCardProps) {
  const [prUrl, setPrUrl] = useState("");
  const [issueText, setIssueText] = useState("");
  const [diffCommand, setDiffCommand] = useState("git diff HEAD~1");
  const [diffOutput, setDiffOutput] = useState("");
  const [isDiffRunning, setIsDiffRunning] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!prUrl.trim()) {
      setError("Please enter a GitHub PR URL.");
      return;
    }
    if (!match) {
      setError("Enter a valid PR URL, e.g. https://github.com/owner/repo/pull/42");
      return;
    }
    const pr: PRInfo = {
      number: parseInt(match[3]),
      title: `feat: add authentication middleware`,
      author: "dev-user",
      baseBranch: "main",
      headBranch: "feat/auth-middleware",
      filesChanged: 7,
      additions: 183,
      deletions: 12,
      url: prUrl,
      issue: issueText || undefined,
      diffCommand: diffCommand || undefined,
    };
    onSubmit(pr);
  };

  const handleRunDiff = () => {
    if (!diffCommand.trim()) return;
    setIsDiffRunning(true);
    setDiffOutput("");
    // Simulate running the git diff command
    setTimeout(() => {
      setDiffOutput(
`diff --git a/src/middleware/auth.ts b/src/middleware/auth.ts
index 4a3f2e1..8b7c9d2 100644
--- a/src/middleware/auth.ts
+++ b/src/middleware/auth.ts
@@ -12,7 +12,18 @@ import { Request, Response, NextFunction } from 'express';
 import jwt from 'jsonwebtoken';
 import { db } from '../db';

-export const authMiddleware = (req, res, next) => {
-  const token = req.headers.authorization;
+export const authMiddleware = async (req, res, next) => {
+  const authHeader = req.headers.authorization;
+  if (!authHeader?.startsWith('Bearer ')) {
+    return res.status(401).json({ error: 'Missing token' });
+  }
+  const token = authHeader.split(' ')[1];
+  try {
+    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
+    const user = await db.users.findById((decoded as any).sub);
+    req.user = user;
     next();
-  });
-};
+  } catch (err) {
+    return res.status(403).json({ error: 'Token invalid' });
+  }
+};`
      );
      setIsDiffRunning(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Repo URL Card ────────────────────────────────────── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col gap-4 hover:border-[#7c5cd8]/40 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1a2634] border border-[#1f6feb]/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#58a6ff]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#e6edf3] text-sm">Pull Request URL</h3>
            <p className="text-[11px] text-[#484f58]">Paste a GitHub PR link to begin analysis</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="url"
            value={prUrl}
            onChange={(e) => { setPrUrl(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="https://github.com/owner/repo/pull/42"
            disabled={isLoading}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3.5 py-2.5 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#7c5cd8] focus:ring-1 focus:ring-[#7c5cd8] transition-colors disabled:opacity-50 font-mono"
          />
          {error && <p className="text-xs text-[#f85149] flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.343 13.657A8 8 0 1 1 13.657 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z" />
            </svg>
            {error}
          </p>}
        </div>
      </div>

      {/* ── Issue Card ────────────────────────────────────────── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col gap-4 hover:border-[#7c5cd8]/40 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0d2114] border border-[#238636]/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#3fb950]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#e6edf3] text-sm">Issue / Context</h3>
            <p className="text-[11px] text-[#484f58]">Describe the issue or provide additional context for the review</p>
          </div>
        </div>

        <textarea
          value={issueText}
          onChange={(e) => setIssueText(e.target.value)}
          placeholder="e.g. This PR introduces JWT authentication middleware. Please check for security vulnerabilities and ensure proper error handling..."
          disabled={isLoading}
          rows={3}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3.5 py-2.5 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#7c5cd8] focus:ring-1 focus:ring-[#7c5cd8] transition-colors disabled:opacity-50 resize-none leading-relaxed"
        />
      </div>

      {/* ── Git Diff Command Card ─────────────────────────────── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col gap-4 hover:border-[#7c5cd8]/40 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2d1b0f] border border-[#d29922]/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#e3b341]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM7.25 8a.749.749 0 0 1-.22.53l-2.25 2.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L5.44 8 3.72 6.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.25 2.25c.141.14.22.331.22.53Zm1.5 1.5h3.25a.75.75 0 0 1 0 1.5H8.75a.75.75 0 0 1 0-1.5Z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#e6edf3] text-sm">Git Diff Command</h3>
            <p className="text-[11px] text-[#484f58]">Enter a git diff command and run it to see changes</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg px-3.5 py-2.5 focus-within:border-[#7c5cd8] focus-within:ring-1 focus-within:ring-[#7c5cd8] transition-colors">
            <span className="text-[#484f58] text-sm mr-2 select-none font-mono">$</span>
            <input
              type="text"
              value={diffCommand}
              onChange={(e) => setDiffCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunDiff()}
              placeholder="git diff HEAD~1"
              disabled={isLoading || isDiffRunning}
              className="flex-1 bg-transparent text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none disabled:opacity-50 font-mono"
            />
          </div>
          <button
            onClick={handleRunDiff}
            disabled={isLoading || isDiffRunning || !diffCommand.trim()}
            className="px-4 py-2.5 bg-[#e3b341] hover:bg-[#f0c950] disabled:opacity-50 disabled:cursor-not-allowed text-[#0d1117] text-sm font-semibold rounded-lg transition-colors active:scale-[0.98] flex items-center gap-2 shrink-0"
          >
            {isDiffRunning ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Running…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"/>
                </svg>
                Run
              </>
            )}
          </button>
        </div>

        {/* Diff output */}
        {diffOutput && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#30363d] bg-[#161b22]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f85149]"/>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e3b341]"/>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950]"/>
                </div>
                <span className="text-[11px] text-[#8b949e] font-mono">{diffCommand}</span>
              </div>
              <button
                onClick={() => setDiffOutput("")}
                className="text-[#484f58] hover:text-[#8b949e] transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
                </svg>
              </button>
            </div>
            <pre className="p-3.5 text-xs font-mono leading-relaxed text-[#8b949e] overflow-x-auto max-h-[300px] overflow-y-auto">
              {diffOutput.split("\n").map((line, i) => {
                const cls = line.startsWith("+") && !line.startsWith("+++")
                  ? "text-[#3fb950] bg-[#3fb950]/5"
                  : line.startsWith("-") && !line.startsWith("---")
                  ? "text-[#f85149] bg-[#f85149]/5"
                  : line.startsWith("@@")
                  ? "text-[#58a6ff] bg-[#58a6ff]/5"
                  : "text-[#8b949e]";
                return <div key={i} className={`px-1 ${cls}`}>{line}</div>;
              })}
            </pre>
          </div>
        )}
      </div>

      {/* ── Start Review Button ───────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#7c5cd8] to-[#a371f7] hover:from-[#8b6ce0] hover:to-[#b085f5] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all active:scale-[0.99] shadow-lg shadow-[#7c5cd8]/20"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Analysing…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"/>
            </svg>
            Start Review
          </span>
        )}
      </button>
    </div>
  );
}
