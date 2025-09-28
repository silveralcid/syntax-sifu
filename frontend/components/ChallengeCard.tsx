"use client";

interface ChallengeCardProps {
  category: string;
  prompt: string;
}

export default function ChallengeCard({
  category,
  prompt,
}: ChallengeCardProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        {/* Category badge (centered) */}
        <div className="flex justify-center mb-4">
          <span className="badge badge-primary uppercase tracking-wide">
            {category}
          </span>
        </div>

        {/* Prompt */}
        <p className="text-base pb-8 pr-8 pl-8">{prompt}</p>
      </div>
    </div>
  );
}
