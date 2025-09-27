// frontend/app/HomeContent.tsx
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

interface Challenge {
  id: number;
  category: string;
  prompt: string;
  fn_name: string;
  tests: { input: unknown[]; output: unknown }[];
}

interface Category {
  category: string;
  count: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("// Write your code here...");
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [language, setLanguage] = useState<"python" | "javascript" | "csharp">(
    "python"
  );

  // fetch categories on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        // backend already returns array of {category, count}
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // fetch challenges
  const fetchChallenges = async () => {
    if (selectedCategories.length === 0) return;

    const query = selectedCategories.join(",");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/challenges?category=${query}&limit=5&shuffle=true`
      );
      const data: Challenge[] = await res.json();
      setChallenges(data);
      setCurrentIndex(0);
      setResult(null);
      setCode("// Write your code here...");
    } catch (err) {
      console.error("Error fetching challenges:", err);
    }
  };

  const currentChallenge =
    challenges.length > 0 ? challenges[currentIndex] : null;

  const handleRunCode = async () => {
    if (!currentChallenge) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submit_code/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            fn_name: currentChallenge.fn_name,
            language: language,
            tests: currentChallenge.tests,
          }),
        }
      );
      const data: SubmitResponse = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error submitting code:", err);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setResult(null);
      setCode("// Write your code here...");
    }
  };

  const prevChallenge = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setResult(null);
      setCode("// Write your code here...");
    }
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Syntax Sifu 🥋</h1>

      {/* Category selection */}
      <div>
        <h2>Select Categories:</h2>
        {categories.map((c, idx) => (
          <label key={`${c.category}-${idx}`} style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              value={c.category}
              checked={selectedCategories.includes(c.category)}
              onChange={() => toggleCategory(c.category)}
            />
            {c.category} ({c.count})
          </label>
        ))}
        <button onClick={fetchChallenges}>Load Challenges</button>
      </div>

      {/* Playlist of loaded challenges */}
      {challenges.length > 0 && (
        <div>
          <h2>Challenge Playlist:</h2>
          <ul>
            {challenges.map((ch, idx) => (
              <li key={`${ch.id}-${idx}`}>
                {idx + 1}. [{ch.category}] {ch.prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Current Challenge */}
      {currentChallenge && (
        <div>
          <h2>Current Challenge:</h2>
          <p>{currentChallenge.prompt}</p>
          <pre>{JSON.stringify(currentChallenge.tests, null, 2)}</pre>
        </div>
      )}

      {/* Language Selector */}
      <div>
        <label className="mr-2">Language:</label>
        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value as "python" | "javascript" | "csharp")
          }
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="csharp">C#</option>
        </select>
      </div>

      {/* Monaco editor */}
      <Editor
        height="300px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value || "")}
      />

      <div className="space-x-2">
        <button onClick={prevChallenge} disabled={currentIndex === 0}>
          Previous Challenge
        </button>
        <button onClick={handleRunCode}>Run Code</button>
        <button
          onClick={nextChallenge}
          disabled={currentIndex >= challenges.length - 1}
        >
          Next Challenge
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          <h2>Results:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
