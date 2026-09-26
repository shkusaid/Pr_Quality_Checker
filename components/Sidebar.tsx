"use client";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  repoName: string;
  findingsCount?: number;
}

const navItems = [
  {
    id: "review",
    label: "PR Review",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z" />
      </svg>
    ),
  },
  {
    id: "agents",
    label: "Agents",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 1.5C0 .672.672 0 1.5 0h13C15.328 0 16 .672 16 1.5v13c0 .828-.672 1.5-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5Zm1.5-.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5Z" />
        <path d="M5 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM5 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
      </svg>
    ),
  },
  {
    id: "findings",
    label: "Findings",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.22 1.754a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-5.25a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0Z" />
      </svg>
    ),
  },
  {
    id: "diff",
    label: "Diff Viewer",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.75 1.75a.75.75 0 0 0-1.5 0V5H4a.75.75 0 0 0 0 1.5h3.25v3.25a.75.75 0 0 0 1.5 0V6.5H12A.75.75 0 0 0 12 5H8.75V1.75ZM4 13a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H4Z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.316.645 6.862.095 7.61.031 7.74.011 7.87 0 8 0Zm-.08 1.5c-.563.038-.895.354-.978.666l-.29 1.107c-.124.474-.489.864-.925 1.088a4.2 4.2 0 0 0-.534.307c-.42.278-.97.32-1.442.185l-1.102-.303c-.316-.087-.645.014-.815.28a6.38 6.38 0 0 0-.57.984c-.124.27-.062.61.162.828l.815.806c.342.339.526.81.503 1.29a4.7 4.7 0 0 0 0 .62c.023.48-.161.95-.503 1.29l-.815.806a.623.623 0 0 0-.162.828c.166.348.358.683.57.984.17.266.499.367.815.28l1.102-.303c.472-.135 1.022-.093 1.442.185.165.11.343.214.534.307.436.224.8.614.925 1.088l.29 1.107c.083.312.415.628.978.666a6.5 6.5 0 0 0 1.162 0c.563-.038.895-.354.978-.666l.29-1.107c.124-.474.489-.864.925-1.088a4.2 4.2 0 0 0 .534-.307c.42-.278.97-.32 1.442-.185l1.102.303c.316.087.645-.014.815-.28.212-.301.404-.636.57-.984a.623.623 0 0 0-.162-.828l-.815-.806a1.484 1.484 0 0 1-.503-1.29 4.69 4.69 0 0 0 0-.62c-.023-.48.161-.95.503-1.29l.815-.806a.623.623 0 0 0 .162-.828 6.38 6.38 0 0 0-.57-.984c-.17-.266-.499-.367-.815-.28l-1.102.303c-.472.135-1.022.093-1.442-.185a4.2 4.2 0 0 0-.534-.307c-.436-.224-.8-.614-.925-1.088L8.898 2.166C8.815 1.854 8.483 1.538 7.92 1.5ZM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeTab, onTabChange, repoName, findingsCount }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-12 bottom-0 w-[180px] bg-[#161b22] border-r border-[#30363d] flex flex-col z-40">
      {/* Workspace label */}
      <div className="px-4 pt-5 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8b949e] mb-3">
          Workspace
        </p>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#7c5cd8] to-[#a371f7] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            R
          </div>
          <span className="text-sm text-[#e6edf3] font-medium truncate">{repoName}</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 mt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
              activeTab === item.id
                ? "bg-[#21262d] text-white"
                : "text-[#8b949e] hover:text-white hover:bg-[#21262d]"
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.id === "findings" && findingsCount !== undefined && findingsCount > 0 && (
              <span className="text-[10px] bg-[#7c5cd8] text-white rounded-full px-1.5 py-0.5 font-semibold min-w-[18px] text-center leading-none">
                {findingsCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="px-4 pb-4 border-t border-[#30363d] pt-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
          <span className="text-[11px] text-[#8b949e]">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
