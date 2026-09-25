"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/types";
import { formatTime } from "@/lib/utils";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "ai",
    text: "Hi! I'm the PR Review Assistant. Paste a pull request URL and click 'Start Review' to begin. I'll retrieve the required context, activate specialised agents, and surface evidence-backed findings.",
    time: "10:24 AM",
  },
];

const AI_REPLIES: Record<string, string> = {
  security: "The Security Agent scans for injection vulnerabilities, insecure secrets handling, authentication flaws, and exposed attack surfaces. Every finding links directly to the offending line.",
  performance: "The Performance Agent detects N+1 queries, missing indexes, unbounded loops, and expensive operations on hot paths. It retrieves caller context to assess real-world impact.",
  test: "The Test Agent checks coverage for changed code paths, verifies that new branches have corresponding tests, and identifies callers that lack unit or integration test coverage.",
  dependency: "The Dependency Agent cross-references changed imports against known vulnerability databases and checks for version mismatches or transitive dependency conflicts.",
  agent: "Agents are activated selectively based on what changed in the PR — only agents relevant to the diff are run, reducing noise and keeping data exposure minimal.",
  context: "Context retrieval is scoped to only the files and symbols required to understand the change. Full-repository cloning is never performed.",
  finding: "All findings include a code evidence block and a remediation suggestion. Limitations (e.g. runtime behaviour, env-specific config) are noted inline.",
  review: "To start a review, paste a GitHub PR URL into the 'Pull Request URL' card and click 'Start Review'. The pipeline will run automatically.",
  diff: "The diff viewer shows only context-retrieved changes. Lines are annotated and cross-referenced with agent findings.",
  evidence: "Each finding contains a direct code snippet (evidence block) so you can verify the claim without leaving the dashboard.",
  issue: "You can provide additional context about the issue you want reviewed. This helps agents focus on the most relevant aspects of the PR.",
  command: "The Git Diff Command card lets you run a git diff locally. Click 'Run' to execute the command and see the diff output inline.",
};

function getAIReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, reply] of Object.entries(AI_REPLIES)) {
    if (lower.includes(key)) return reply;
  }
  return `I can help you understand the review results for "${input.slice(0, 40)}". Ask me about agents, findings, evidence, diff context, or how the review pipeline works.`;
}

export default function ChatPanel({ repoName }: { repoName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: getAIReply(trimmed),
        time: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="fixed right-0 top-14 bottom-0 w-[280px] bg-[#161b22]/95 backdrop-blur-md border-l border-[#30363d] flex flex-col z-40">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#30363d]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c5cd8] to-[#a371f7] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg shadow-[#7c5cd8]/20">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold text-[#e6edf3]">PR Review Assistant</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-[#3fb950]" />
              <span className="text-xs text-[#8b949e]">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="px-3 pt-3 flex flex-wrap gap-1.5">
        {["How do agents work?", "What is evidence?", "Explain findings", "Git diff command?"].map((q) => (
          <button
            key={q}
            onClick={() => { setInput(q); }}
            className="text-[10px] px-2 py-1 rounded-full bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#7c5cd8] transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 mt-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className="flex items-center gap-2">
              {msg.role === "ai" && <span className="text-[11px] font-medium text-[#8b949e]">AI</span>}
              {msg.role === "user" && <span className="text-[11px] font-medium text-[#8b949e]">You</span>}
              <span className="text-[10px] text-[#484f58]">{msg.time}</span>
            </div>
            <div className={`max-w-full rounded-xl px-3 py-2 text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-gradient-to-r from-[#7c5cd8] to-[#a371f7] text-white rounded-tr-sm"
                : "bg-[#21262d] text-[#e6edf3] rounded-tl-sm border border-[#30363d]"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[11px] font-medium text-[#8b949e]">AI · typing…</span>
            <div className="bg-[#21262d] border border-[#30363d] rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8b949e] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-4 pt-2 border-t border-[#30363d]">
        <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 focus-within:border-[#7c5cd8] focus-within:ring-1 focus-within:ring-[#7c5cd8] transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about the review…"
            className="flex-1 bg-transparent text-xs text-[#e6edf3] placeholder-[#484f58] focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || typing}
            className="text-[#7c5cd8] hover:text-[#9370f0] disabled:text-[#484f58] disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M.989 8 .064 2.68a1.342 1.342 0 0 1 1.85-1.462l13.402 5.744a1.13 1.13 0 0 1 0 2.076L1.913 14.782a1.342 1.342 0 0 1-1.85-1.463L.99 8Zm.603-5.32L2.15 7.25h4.063a.75.75 0 0 1 0 1.5H2.15l-.557 4.568L13.39 8 1.592 2.68Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
