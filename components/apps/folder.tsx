"use client";

interface FolderProps {
  isDarkMode?: boolean;
  title: string;
  github: string;
  live?: string;
}

export default function Folder({ isDarkMode = true, title, github, live }: FolderProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-100";

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* GitHub Repo */}
        <div
          className="cursor-pointer flex flex-col items-center hover:opacity-90"
          onClick={() => window.open(github, "_blank")}
        >
          <img src="/github.png" className="w-16 h-16 mb-2" alt="GitHub" />
          <span className="text-sm">GitHub Repo</span>
        </div>

        {/* Live Demo (only if exists) */}
        {live && (
          <div
            className="cursor-pointer flex flex-col items-center hover:opacity-90"
            onClick={() => window.open(live, "_blank")}
          >
            <img src="/link.png" className="w-16 h-16 mb-2" alt="Live Demo" />
            <span className="text-sm">Live Demo</span>
          </div>
        )}
      </div>

      {!live && (
        <p className="text-gray-400 mt-4 text-sm">
          ⚠️ No Live Demo available for this project.
        </p>
      )}
    </div>
  );
}
