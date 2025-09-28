"use client";

import { useState } from "react";
import MonacoEditorWrapper from "@/components/MonacoEditorWrapper";
import ChallengeCard from "@/components/ChallengeCard";
import TestCases from "@/components/TestCases";
import ChallengeControls from "@/components/ChallengeControls";
import ResultModal from "@/components/ResultModal";
import CompletionModal from "@/components/CompletionModal";
import type { Challenge } from "@/types/challenge";
import type { SubmitResponse } from "@/types/submit";

export default function Home() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState<string>("");

  const [results, setResults] = useState<SubmitResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);

  const [completed, setCompleted] = useState(0);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionReason, setCompletionReason] = useState<
    "timeout" | "finished"
  >("finished");
  const [timeLeft, setTimeLeft] = useState(120); // sync with ChallengeControls duration

  const currentChallenge = challenges[currentIndex];

  const handleTimeout = () => {
    setCompletionReason("timeout");
    setCompletionOpen(true);
  };

  const handleLoad = (newChallenges: Challenge[]) => {
    setChallenges(newChallenges);
    setCurrentIndex(0);
    setUserCode("");
    setCompleted(0);
    setCompletionOpen(false);
  };

  const handleSkip = () => {
    if (currentIndex + 1 >= challenges.length) {
      setCompletionReason("finished");
      setCompletionOpen(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setUserCode("");
  };

  const handleSubmit = async () => {
    if (!currentChallenge) return;

    setPaused(true);
    setResults(null);
    setModalOpen(true);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submit_code/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: userCode,
            fn_name: currentChallenge.fn_name,
            language: "python",
            tests: currentChallenge.tests,
            prompt: currentChallenge.prompt,
          }),
        }
      );

      const data: SubmitResponse = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error submitting code:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setModalOpen(false);
    setResults(null);

    // Mark as completed
    setCompleted((c) => c + 1);

    // Finished queue
    if (currentIndex + 1 >= challenges.length) {
      setCompletionReason("finished");
      setCompletionOpen(true);
      return;
    }

    // Move to next challenge
    setCurrentIndex((i) => i + 1);
    setUserCode("");
    setPaused(false);
  };

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="grid grid-cols-5 grid-rows-5 gap-4 w-screen h-screen max-w-6xl max-h-[90vh]"
          style={{ gridTemplateRows: "repeat(5, 1fr)" }}
        >
          {/* Editor */}
          <div className="rounded-3xl col-span-3 row-span-5 col-start-1 flex items-center justify-center">
            <MonacoEditorWrapper
              code={userCode}
              language="python"
              onChange={(val) => setUserCode(val || "")}
            />
          </div>

          {/* Challenge card */}
          <div className="rounded-3xl col-span-2 row-span-2 col-start-4 flex items-center justify-center bg-base-200">
            {currentChallenge ? (
              <ChallengeCard
                category={currentChallenge.category}
                prompt={currentChallenge.prompt}
                fn_name={currentChallenge.fn_name}
                currentIndex={currentIndex}
                total={challenges.length}
              />
            ) : (
              <p className="text-sm text-gray-500">No challenge loaded</p>
            )}
          </div>

          {/* Controls */}
          <div className="rounded-3xl col-span-2 row-start-3 col-start-4 bg-base-200 flex items-center justify-center">
            <ChallengeControls
              onSkip={handleSkip}
              onSubmit={handleSubmit}
              onSettingsLoad={handleLoad}
              hasChallenges={challenges.length > 0}
              paused={paused}
              onTimeout={handleTimeout}
              onTick={setTimeLeft}
            />
          </div>

          {/* Test cases */}
          <div className="rounded-3xl col-span-2 row-span-2 row-start-4 col-start-4 bg-base-200 flex items-center justify-center">
            {currentChallenge?.tests ? (
              <TestCases tests={currentChallenge.tests} />
            ) : (
              <p className="text-sm text-gray-500">No tests available</p>
            )}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={modalOpen}
        onClose={handleNext}
        results={results}
        loading={loading}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={completionOpen}
        onClose={() => setCompletionOpen(false)}
        completed={completed}
        total={challenges.length}
        timeLeft={timeLeft}
        reason={completionReason}
      />
    </main>
  );
}
