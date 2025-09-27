"use client";
import Editor from "@monaco-editor/react";

export default function MonacoEditor() {
  return (
    <Editor
      className="h-full w-full"
      height="100%"
      defaultLanguage="python"
      defaultValue={"// Start coding here"}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
