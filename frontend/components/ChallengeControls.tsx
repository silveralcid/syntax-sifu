"use client";

import { useEffect, useState } from "react";
import SettingsModal from "@/components/SettingsModal";
import type { Challenge } from "@/types/challenge";

interface ChallengeControlsProps {
  onSkip?: () => void;
  onSubmit?: () => void;
  onSettingsLoad: (challenges: Challenge[]) => void;
  hasChallenges: boolean; // 👈 new
  duration?: number;
}

export default function ChallengeControls({
  onSkip,
  onSubmit,
  onSettingsLoad,
  hasChallenges,
  duration = 120,
}: ChallengeControlsProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isOpen, setIsOpen] = useState(false);

  // Reset timer whenever new challenges are loaded
  useEffect(() => {
    if (hasChallenges) {
      setTimeLeft(duration);
    }
  }, [hasChallenges, duration]);

  // Countdown effect
  useEffect(() => {
    if (!hasChallenges || timeLeft <= 0) return;

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, hasChallenges]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      {/* Timer */}
      {hasChallenges ? (
        <span className="badge badge-lg badge-primary">{timeLeft}s</span>
      ) : (
        <span className="badge badge-lg">Waiting for challenge...</span>
      )}

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={onSkip}
          disabled={!hasChallenges}
          className="btn btn-error btn-sm md:btn-md"
        >
          Skip
        </button>
        <button
          onClick={onSubmit}
          disabled={!hasChallenges}
          className="btn btn-success btn-sm md:btn-md"
        >
          Submit
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-info btn-sm md:btn-md"
        >
          Settings
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLoad={(challenges) => {
          onSettingsLoad(challenges);
          setIsOpen(false);
        }}
      />
    </div>
  );
}
