"use client";

import type { DiffLine } from "@/types";

function parseDiff(raw: string): DiffLine[] {
  return raw.split("\n").map((line): DiffLine => {
    if (line.startsWith("+++") || line.startsWith("---")) return { type: "meta", content: line };
    if (line.startsWith("@@")) return { type: "header", content: line };
    if (line.startsWith("+")) return { type: "add", content: line };
    if (line.startsWith("-")) return { type: "remove", content: line };
    if (line.startsWith("diff ") || line.startsWith("index ")) return { type: "meta", content: line };
    return { type: "context", content: line };
  });
}

const SAMPLE_DIFF = `diff --git a/src/middleware/auth.ts b/src/middleware/auth.ts
index 4a3f2e1..8b7c9d2 100644
--- a/src/middleware/auth.ts
+++ b/src/middleware/auth.ts
@@ -12,7 +12,18 @@ import { Request, Response, NextFunction } from 'express';
 import jwt from 'jsonwebtoken';
 import { db } from '../db';
 
-export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
-  const token = req.headers.authorization;
-  if (!token) return res.status(401).json({ error: 'Unauthorized' });
-  jwt.verify(token, process.env.SECRET, (err, decoded) => {
-    if (err) return res.status(403).json({ error: 'Forbidden' });
-    req.user = decoded;
-    next();
-  });
-};
+export const authMiddleware = async (
+  req: Request,
+  res: Response,
+  next: NextFunction
+) => {
+  const authHeader = req.headers.authorization;
+  if (!authHeader?.startsWith('Bearer ')) {
+    return res.status(401).json({ error: 'Missing or invalid token' });
+  }
+  const token = authHeader.split(' ')[1];
+  try {
+    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
+    const user = await db.users.findById((decoded as any).sub);
+    if (!user) return res.status(401).json({ error: 'User not found' });
+    req.user = user;
+    next();
+  } catch (err) {
+    return res.status(403).json({ error: 'Token invalid or expired' });
+  }
+};`;

interface DiffViewerProps {
  rawDiff?: string;
  filesChanged?: number;
  additions?: number;
  deletions?: number;
}

export default function DiffViewer({
  rawDiff = SAMPLE_DIFF,
  filesChanged = 7,
  additions = 183,
  deletions = 12,
}: DiffViewerProps) {
  const lines = parseDiff(rawDiff);

  return (
    <div className="flex flex-col gap-4">
      {/* Stat bar */}
      <div className="flex items-center gap-4 bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-[#8b949e]">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 2.5A2.5 2.5 0 0 1 3.5 0h8.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V1.5h-8a1 1 0 0 0-1 1v6.708A2.492 2.492 0 0 1 3.5 9h3.25a.75.75 0 0 1 0 1.5H3.5a1 1 0 0 0 0 2h5.75a.75.75 0 0 1 0 1.5H3.5A2.5 2.5 0 0 1 1 11.5Zm13.23 7.79-.032-.032a5.001 5.001 0 0 0-7.07 7.07l.033.032.031.033a5 5 0 0 0 7.07-7.07ZM13 10.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
          </svg>
          <span className="font-semibold text-[#e6edf3]">{filesChanged}</span> files changed
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold text-[#3fb950]">+{additions}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold text-[#f85149]">−{deletions}</span>
        </div>
        {/* Diff bar */}
        <div className="flex-1 flex gap-0.5 h-2 max-w-[120px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i < Math.round((additions / (additions + deletions)) * 5)
                  ? "bg-[#3fb950]"
                  : "bg-[#f85149]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Diff output */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d] bg-[#161b22]">
          <span className="text-xs text-[#8b949e] font-mono">src/middleware/auth.ts</span>
          <span className="text-[11px] text-[#484f58]">Context-retrieved diff</span>
        </div>
        <div className="diff-output overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const cls =
                  line.type === "add" ? "diff-add" :
                  line.type === "remove" ? "diff-remove" :
                  line.type === "header" ? "diff-header" :
                  "text-[#8b949e]";
                return (
                  <tr key={idx} className={`${cls} hover:bg-white/5`}>
                    <td className="select-none pl-4 pr-2 py-0 text-right text-[#484f58] w-10 text-[11px] border-r border-[#21262d]">
                      {line.type !== "meta" && line.type !== "header" ? idx + 1 : ""}
                    </td>
                    <td className="px-4 py-0 whitespace-pre">{line.content}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-[#484f58] text-center">
        Only repository context required for the change is retrieved — no full-repo clone.
      </p>
    </div>
  );
}
