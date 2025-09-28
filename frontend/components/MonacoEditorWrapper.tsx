"use client";

import Editor from "@monaco-editor/react";

export default function CodeWindow() {
  return (
    <div className="mockup-window border border-base-300 w-full h-full">
      {/* content area */}
      <div className="border-t border-base-300 w-full h-full rounded-b-xl overflow-hidden">
        <Editor
          className="w-full h-full"
          defaultLanguage="python"
          defaultValue={"# Start typing..."}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
