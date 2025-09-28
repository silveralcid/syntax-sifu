"use client";

import { useState } from "react";
import MonacoEditorWrapper from "@/components/MonacoEditorWrapper";
import ChallengeCard from "@/components/ChallengeCard";
import TestCases from "@/components/TestCases";
import ChallengeControls from "@/components/ChallengeControls";

interface Challenge {
  id: number;
  category: string;
  prompt: string;
  fn_name: string;
  tests?: { input: unknown[]; output: unknown }[];
}

export default function Home() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentChallenge = challenges[currentIndex];

  const handleLoad = (newChallenges: Challenge[]) => {
    setChallenges(newChallenges);
    setCurrentIndex(0); // reset queue to first challenge
  };

  const handleSkip = () => {
    if (!challenges.length) return;
    setCurrentIndex((i) => (i + 1 < challenges.length ? i + 1 : 0));
  };

  const handleSubmit = () => {
    console.log("Submitted:", currentChallenge);
    // TODO: hook into validation API
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
            <MonacoEditorWrapper />
          </div>

          {/* Right column top half: ChallengeCard */}
          <div className="rounded-3xl col-span-2 row-span-2 col-start-4 flex items-center justify-center bg-base-200">
            {currentChallenge ? (
              <ChallengeCard
                category={currentChallenge.category}
                prompt={currentChallenge.prompt}
              />
            ) : (
              <p className="text-sm text-gray-500">No challenge loaded</p>
            )}
          </div>

          {/* Right column middle half: ChallengeControls */}
          <div className="rounded-3xl col-span-2 row-start-3 col-start-4 bg-base-200 flex items-center justify-center">
            <ChallengeControls
              onSkip={handleSkip}
              onSubmit={handleSubmit}
              onSettingsLoad={handleLoad}
            />
          </div>

          {/* Bottom right: TestCases */}
          <div className="rounded-3xl col-span-2 row-span-2 row-start-4 col-start-4 bg-base-200 flex items-center justify-center">
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
