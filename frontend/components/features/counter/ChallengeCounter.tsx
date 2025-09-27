// components/features/challenges/ChallengeCounter.tsx
"use client";


interface ChallengeCounterProps {
completed: number;
total: number;
}


export default function ChallengeCounter() {
return (
<div className="grid grid-cols-2 h-full w-full">
<div className="flex flex-col items-center justify-center">
<div className="text-7xl font-bold leading-none">3</div>
<div className="text-xs mt-1">Complete</div>
</div>
<div className="flex flex-col items-center justify-center">
<div className="text-7xl font-bold leading-none">10</div>
<div className="text-xs mt-1">Total</div>
</div>
</div>
);
}