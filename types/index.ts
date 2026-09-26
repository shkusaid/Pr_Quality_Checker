export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

export interface RepoInfo {
  url: string;
  owner: string;
  name: string;
  branch: string;
  connected: boolean;
}

export interface DiffResult {
  raw: string;
  lines: DiffLine[];
}

export interface DiffLine {
  type: "add" | "remove" | "context" | "header" | "meta";
  content: string;
}

export type AgentStatus = "idle" | "activating" | "running" | "done" | "skipped";

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  findingsCount?: number;
  icon: "security" | "performance" | "style" | "test" | "dependency" | "context";
}

export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface Finding {
  id: string;
  agentId: string;
  agentName: string;
  severity: FindingSeverity;
  title: string;
  description: string;
  file: string;
  line?: number;
  evidence: string;
  evidenceType: "code" | "caller" | "test" | "config" | "dependency";
  remediation?: string;
}

export interface PRInfo {
  number: number;
  title: string;
  author: string;
  baseBranch: string;
  headBranch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  description?: string;
  url?: string;
  issue?: string;
  diffCommand?: string;
}

export type ReviewStatus = "idle" | "loading_context" | "activating_agents" | "reviewing" | "verifying" | "done";
