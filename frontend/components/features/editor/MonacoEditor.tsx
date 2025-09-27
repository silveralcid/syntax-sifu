
"use client";
import Editor from "@monaco-editor/react";

export default function MonacoEditor() {
  return (
    <div className="w-full h-screen">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        defaultValue={"// Start coding here"}
        theme="vs-dark"
      />
    </div>
  );
}