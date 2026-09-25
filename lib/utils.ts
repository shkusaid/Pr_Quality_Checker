import { DiffResult, DiffLine } from "@/types";

/**
 * Parses a raw git diff string into structured lines.
 */
export function parseDiff(raw: string): DiffResult {
  const lines = raw.split("\n").map((line): DiffLine => {
    if (line.startsWith("+++") || line.startsWith("---")) {
      return { type: "meta", content: line };
    }
    if (line.startsWith("@@")) {
      return { type: "header", content: line };
    }
    if (line.startsWith("+")) {
      return { type: "add", content: line };
    }
    if (line.startsWith("-")) {
      return { type: "remove", content: line };
    }
    if (line.startsWith("diff ") || line.startsWith("index ")) {
      return { type: "meta", content: line };
    }
    return { type: "context", content: line };
  });

  return { raw, lines };
}

/**
 * Extracts owner and repo name from a GitHub URL.
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const cleaned = url.replace(/\.git$/, "").trim();
    const match = cleaned.match(
      /github\.com[/:]([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/
    );
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns a friendly display name for a diff command.
 */
export function getDiffLabel(command: string): string {
  if (command === "git diff HEAD~1") return "Changes since last commit";
  if (command === "git diff --stat") return "Diff statistics";
  if (command === "git log --oneline -10") return "Last 10 commits";
  return command;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
