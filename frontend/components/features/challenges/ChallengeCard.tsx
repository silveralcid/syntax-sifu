"use client";

import React from "react";

interface ChallengeCardProps {
  title: string;
  content: React.ReactNode;
}

export default function ChallengeCard({ title, content }: ChallengeCardProps) {
  return (
    <div className="card w-full h-full">
      <div className="card-body p-4 overflow-y-auto">
        <h2 className="card-title text-lg mb-2">{title}</h2>
        <div className="text-sm">{content}</div>
      </div>
    </div>
  );
}
