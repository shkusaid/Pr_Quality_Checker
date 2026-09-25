


interface NavbarProps {
  repoOwner: string;
  repoName: string;
  branch: string;
  prNumber?: number;
}

export default function Navbar({ repoOwner, repoName, branch, prNumber }: NavbarProps) {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#161b22]/95 backdrop-blur-md border-b border-[#30363d] flex items-center px-5 gap-4">
      {/* Logo + breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Custom Robot Logo */}
        <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
          <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
            {/* Antenna */}
            <circle cx="50" cy="10" r="5" fill="white"/>
            <rect x="48" y="14" width="4" height="10" rx="2" fill="white"/>
            {/* Head */}
            <rect x="18" y="24" width="64" height="46" rx="18" fill="white"/>
            {/* Face screen */}
            <rect x="26" y="32" width="48" height="30" rx="12" fill="#2563eb"/>
            {/* Eyes */}
            <ellipse cx="39" cy="47" rx="5" ry="5.5" fill="white"/>
            <ellipse cx="61" cy="47" rx="5" ry="5.5" fill="white"/>
            {/* Ears */}
            <rect x="8" y="38" width="12" height="18" rx="6" fill="white"/>
            <rect x="80" y="38" width="12" height="18" rx="6" fill="white"/>
          </svg>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[15px] font-bold text-white tracking-tight">PR Review</span>
          <span className="text-[15px] font-light text-[#7c5cd8]">AI</span>
        </div>
        <div className="h-5 w-px bg-[#30363d] mx-1" />
        <span className="text-[#8b949e] text-sm">{repoOwner}</span>
        <span className="text-[#484f58] text-sm">/</span>
        <span className="text-white font-semibold text-sm">{repoName}</span>
        <span className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-[#21262d] border border-[#30363d] text-[#8b949e] text-xs">
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Z" />
          </svg>
          {branch}
        </span>
        {prNumber && (
          <span className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-[#1a2634] border border-[#1f6feb] text-[#58a6ff] text-xs font-mono">
            PR #{prNumber}
          </span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="relative p-1.5 text-[#8b949e] hover:text-white transition-colors rounded-lg hover:bg-[#21262d]">
          <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM8 1.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.75 1.75 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#7c5cd8] rounded-full border-2 border-[#161b22]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c5cd8] to-[#a371f7] flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-[#30363d]">
          A
        </div>
      </div>
    </header>
  );
}
