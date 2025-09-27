// frontend/app/HomeContent.tsx
"use client";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

type Category = string | { category: string };


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

export default function HomeContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );
  const [code, setCode] = useState("// Write your code here...");
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch categories on mount
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

  // fetch challenges
  const fetchChallenges = async () => {
    if (selectedCategories.length === 0) {
      alert("Pick at least one category!");
      return;
    }

    const query = selectedCategories.join(",");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/challenges?category=${query}&limit=5&shuffle=true`
      );
      const data: Challenge[] = await res.json();
      console.log("Fetched challenges:", data);

      setChallenges(data);
      setCurrentChallenge(data[0] || null);
    } catch (err) {
      console.error("Error fetching challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  // run code against backend
  const handleRunCode = async () => {
    if (!currentChallenge) {
      alert("No challenge loaded yet!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submit_code/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            fn_name: currentChallenge.fn_name,
            language: "python", // default for now
            tests: currentChallenge.tests,
          }),
        }
      );
      const data: SubmitResponse = await res.json();
      console.log("Run code result:", data);

      setResult(data);
    } catch (err) {
      console.error("Error submitting code:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Syntax Sifu 🥋</h1>

      {/* Category selection */}
      <div>
        <h2>Select Categories:</h2>
        {categories.map((c, idx) => {
          const value = typeof c === "string" ? c : c.category;
          return (
            <label key={`${value}-${idx}`} style={{ marginRight: "1rem" }}>
              <input
                type="checkbox"
                value={value}
                checked={selectedCategories.includes(value)}
                onChange={() => toggleCategory(value)}
              />
              {value}
            </label>
          );
        })}

        <button onClick={fetchChallenges}>Load Challenges</button>
      </div>

      {/* Challenge list */}
      {challenges.length > 0 && (
        <div>
          <h2>Challenges:</h2>
          <ul>
            {challenges.map((ch) => (
              <li key={ch.id}>
                <button onClick={() => setCurrentChallenge(ch)}>
                  {ch.prompt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Challenge display */}
      {currentChallenge && (
        <div>
          <h2>Current Challenge:</h2>
          <p>{currentChallenge.prompt}</p>
          <pre>{JSON.stringify(currentChallenge.tests, null, 2)}</pre>
        </div>
      )}

      {/* Monaco editor */}
      <Editor
        height="300px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value || "")}
      />

      <button onClick={handleRunCode} disabled={loading}>
        {loading ? "Working..." : "Run Code"}
      </button>

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
