"use client";

import { useState } from "react";
import { Challenge } from "@/types/challenge";

interface TestCase {
  input: unknown[];
  output: unknown;
}

interface TestCasesProps {
  tests: TestCase[];
}

export default function TestCases({ tests }: TestCasesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="w-full h-full flex flex-col bg-base-100 shadow-xl border border-base-300 rounded-2xl overflow-hidden">
      {/* Horizontal menu pinned to top, items full-width, text centered */}
      <div className="w-full overflow-x-auto">
        <ul className="menu menu-horizontal w-full">
          {tests.map((_, i) => (
            <li key={i} className="flex-1">
              <button
                className={`w-full flex items-center justify-center py-2 ${
                  i === selectedIndex
                    ? "bg-primary text-primary-content font-semibold border-primary"
                    : "hover:bg-base-200"
                }`}
                onClick={() => setSelectedIndex(i)}
              >
                Test {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Test details fill the rest */}
      <div className="flex-1 flex items-center justify-center p-4 text-center overflow-auto">
        <div>
          <p className="text-sm text-gray-500">Input:</p>
          <pre className="bg-base-200 p-2 rounded-md mb-2">
            {JSON.stringify(tests[selectedIndex].input)}
          </pre>

          <p className="text-sm text-gray-500">Expected Output:</p>
          <pre className="bg-base-200 p-2 rounded-md">
            {JSON.stringify(tests[selectedIndex].output)}
          </pre>
        </div>
      </div>
    </div>
  );
}
