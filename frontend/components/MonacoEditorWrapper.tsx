"use client";

import Editor from "@monaco-editor/react";
import { Challenge } from "@/types/challenge";

interface MonacoEditorWrapperProps {
  code: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
}

export default function MonacoEditorWrapper({
  code,
  language = "python",
  onChange,
}: MonacoEditorWrapperProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={code} // 👈 use value instead of defaultValue for controlled input
      theme="vs-dark"
      onChange={onChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
}
