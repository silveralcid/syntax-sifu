// frontend/app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

// Types for API responses
interface ValidationResult {
  passed: boolean;
  failed_cases: { input: unknown; expected: unknown; got: unknown }[];
  error: string | null;
}

interface SubmitResponse {
  status: "ok" | "error";
  results?: ValidationResult;
  message?: string;
}

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [code, setCode] = useState("// Pick a challenge, write code here...");
  const [result, setResult] = useState<SubmitResponse | null>(null);

  // fetch categories from backend
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleRunCode = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit_code/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          fn_name: "dummy_function", // TODO: replace when you fetch challenge
          language: "python",        // TODO: make user-selectable
          tests: [{ input: [5], output: 120 }],
        }),
      });
      const data: SubmitResponse = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error submitting code:", err);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Syntax Sifu 🥋</h1>

      {/* Categories selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Pick Category:</label>
        <select
          className="select select-bordered"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- choose one --</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Monaco editor */}
      <div className="border rounded-lg shadow-lg mb-4">
        <Editor
          height="400px"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>

      <button className="btn btn-primary" onClick={handleRunCode}>
        Run Code
      </button>

      {/* Results */}
      {result && (
        <pre className="mt-4 bg-base-200 p-4 rounded-lg">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
