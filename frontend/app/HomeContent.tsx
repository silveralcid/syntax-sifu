// frontend/app/HomeContent.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";

// --- Types ---
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

  // Timer state
  const [timeLeft, setTimeLeft] = useState(300);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

// Timer effect
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // cleanup function
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, timeLeft]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Fetch challenges
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
      setTimeLeft(300);
      setIsPaused(false);
    } catch (err) {
      console.error("Error fetching challenges:", err);
    }
  };

  const currentChallenge = challenges[currentIndex] || null;

  const handleRunCode = async () => {
    if (!currentChallenge) return;
    setIsPaused(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submit_code/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            fn_name: currentChallenge.fn_name,
            language,
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
      setCurrentIndex((i) => i + 1);
      setResult(null);
      setCode("// Write your code here...");
      setIsPaused(false);
    }
  };
  const prevChallenge = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setResult(null);
      setCode("// Write your code here...");
      setIsPaused(false);
    }
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Syntax Sifu 🥋</h1>
      <h2>Time Left: {formatTime(timeLeft)}</h2>

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
        <button
          style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px" }}
          onClick={fetchChallenges}
        >
          Load Challenges
        </button>
      </div>

      {/* Playlist */}
      <div>
        <h2>Challenge Playlist:</h2>
        {challenges.length === 0 ? (
          <p>No challenges loaded yet.</p>
        ) : (
          <ul>
            {challenges.map((ch, idx) => (
              <li
                key={`${ch.id}-${idx}`}
                style={{
                  textDecoration: idx === currentIndex ? "underline" : "none",
                }}
              >
                {idx + 1}. [{ch.category}] {ch.prompt}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Current challenge */}
      <div>
        <h2>Current Challenge:</h2>
        {currentChallenge ? (
          <>
            <p>
              <strong>[{currentChallenge.category}]</strong>{" "}
              {currentChallenge.prompt}{" "}
              <em>(Function name: <code>{currentChallenge.fn_name}</code>)</em>
            </p>
            <pre>{JSON.stringify(currentChallenge.tests, null, 2)}</pre>
          </>
        ) : (
          <p>No challenge selected.</p>
        )}
      </div>

      {/* Language */}
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

      {/* Editor */}
      <Editor
        height="300px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value || "")}
      />

      {/* Buttons */}
      <div className="space-x-2 mt-2">
        <button
          style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px" }}
          onClick={prevChallenge}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px" }}
          onClick={handleRunCode}
          disabled={!currentChallenge}
        >
          Run Code
        </button>
        <button
          style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px" }}
          onClick={nextChallenge}
          disabled={currentIndex >= challenges.length - 1}
        >
          Next
        </button>
      </div>

      {/* Results */}
      <div>
        <h2>Results:</h2>
        {result ? (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <p>No submission yet.</p>
        )}
      </div>
    </main>
  );
}
