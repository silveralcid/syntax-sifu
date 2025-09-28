"use client";

interface ChallengeCardProps {
  category: string;
  prompt: string;
  fn_name: string; // 👈 new prop
  currentIndex: number; // 0-based index
  total: number;
}

export default function ChallengeCard({
  category,
  prompt,
  fn_name,
  currentIndex,
  total,
}: ChallengeCardProps) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center w-full">
        {/* Category badge */}
        <div className="flex justify-center mb-4">
          <span className="badge badge-primary uppercase tracking-wide">
            {category}
          </span>
        </div>

        {/* Function name */}
        <p className="text-sm font-mono text-secondary mb-2">
          Function: <code>{fn_name}</code>
        </p>

        {/* Prompt */}
        <p className="text-base pb-6 px-6">{prompt}</p>

        {/* Progress */}
        <p className="text-sm text-gray-500 mt-4">
          {currentIndex + 1} / {total}
        </p>
      </div>
    </div>
  );
}
