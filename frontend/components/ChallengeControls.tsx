"use client";

import { useEffect, useState } from "react";
import SettingsModal from "@/components/SettingsModal";

interface Challenge {
  id: number;
  category: string;
  prompt: string;
  fn_name: string;
}

interface ChallengeControlsProps {
  onSkip?: () => void;
  onSubmit?: () => void;
  onSettingsLoad: (challenges: Challenge[]) => void;
  duration?: number;
}

export default function ChallengeControls({
  onSkip,
  onSubmit,
  onSettingsLoad,
  duration = 300,
}: ChallengeControlsProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      {/* Timer */}
      <span className="badge badge-lg badge-primary">{timeLeft}s</span>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={onSkip} className="btn btn-error btn-sm md:btn-md">
          Skip
        </button>
        <button onClick={onSubmit} className="btn btn-success btn-sm md:btn-md">
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
