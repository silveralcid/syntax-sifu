"use client";

import { useState } from "react";
import MonacoEditorWrapper from "@/components/MonacoEditorWrapper";
import ChallengeCard from "@/components/ChallengeCard";
import TestCases from "@/components/TestCases";
import ChallengeControls from "@/components/ChallengeControls";

import { Challenge } from "@/types/challenge";

interface Submission {
  challengeId: number;
  category: string;
  prompt: string;
  code: string;
}

export default function Home() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState<string>(""); // from Monaco
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const currentChallenge = challenges[currentIndex];

  const handleLoad = (newChallenges: Challenge[]) => {
    setChallenges(newChallenges);
    setCurrentIndex(0);
    setUserCode(""); // reset editor
  };

  const handleSkip = () => {
    setCurrentIndex((i) => (i + 1 < challenges.length ? i + 1 : 0));
    setUserCode("");
  };

  const handleSubmit = () => {
    if (!currentChallenge) return;

    // Append submission
    setSubmissions((prev) => [
      ...prev,
      {
        challengeId: currentChallenge.id,
        category: currentChallenge.category,
        prompt: currentChallenge.prompt,
        code: userCode,
      },
    ]);

    console.log("All submissions so far:", submissions);

    // Move to next challenge
    setCurrentIndex((i) => (i + 1 < challenges.length ? i + 1 : 0));
    setUserCode("");
  };

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="grid grid-cols-5 grid-rows-5 gap-4 w-screen h-screen max-w-6xl max-h-[90vh]"
          style={{ gridTemplateRows: "repeat(5, 1fr)" }}
        >
          {/* Editor on the left */}
          <div className="rounded-3xl col-span-3 row-span-5 col-start-1 flex items-center justify-center">
            <MonacoEditorWrapper
              code={userCode}
              language="python"
              onChange={(val) => setUserCode(val || "")}
            />
          </div>

          {/* Right column top half: Challenge card */}
          <div className="rounded-3xl col-span-2 row-span-2 col-start-4 flex items-center justify-center">
            {currentChallenge ? (
              <ChallengeCard
                category={currentChallenge.category}
                prompt={currentChallenge.prompt}
              />
            ) : (
              <p className="text-sm text-gray-500">No challenge loaded</p>
            )}
          </div>

          {/* Right column middle half: Controls */}
          <div className="rounded-3xl col-span-2 row-start-3 col-start-4 flex items-center justify-center">
            <ChallengeControls
              onSkip={handleSkip}
              onSubmit={handleSubmit}
              onSettingsLoad={handleLoad}
              hasChallenges={challenges.length > 0}
            />
          </div>

          {/* Bottom right: Test cases */}
          <div className="rounded-3xl col-span-2 row-span-2 row-start-4 col-start-4 flex items-center justify-center">
            {currentChallenge?.tests ? (
              <TestCases tests={currentChallenge.tests} />
            ) : (
              <p className="text-sm text-gray-500">No tests available</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
