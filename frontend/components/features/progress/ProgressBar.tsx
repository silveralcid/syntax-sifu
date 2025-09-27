"use client";
import { useEffect, useState } from "react";

export default function ProgressBar() {
  const duration = 60; // total time in seconds
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="relative w-full flex items-center">
      {/* Progress bar */}
      <progress
        className="progress progress-primary w-full"
        value={progress}
        max="100"
        style={{ height: "3rem" }} // makes bar taller so text fits
      ></progress>
    </div>
  );
}
