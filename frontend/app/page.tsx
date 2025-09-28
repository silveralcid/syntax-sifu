import MonacoEditorWrapper from "@/components/MonacoEditorWrapper";
import ChallengeCard from "@/components/ChallengeCard";
import TestCases from "@/components/TestCases";

const challenge = {
  tests: [
    { input: [[]], output: true },
    { input: [[1]], output: false },
    { input: [[1, 2, 3, 4]], output: false },
  ],
};

export default function Home() {
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

          {/* Right column top half */}
          <div className="rounded-3xl col-span-2 row-span-2 col-start-4 flex items-center justify-center bg-red-300">
            <ChallengeCard
              category="Array"
              prompt="Write a function named sum_even_numbers that takes an array of integers and returns the sum of all even numbers."
            />
          </div>

          {/* Right column middle half (now Box 3, keep small size) */}
          <div className="rounded-3xl col-span-2 row-start-3 col-start-4 bg-blue-300 flex items-center justify-center">
            3
          </div>

          {/* Bottom right (now TestCases, keep tall size) */}
          <div className="rounded-3xl col-span-2 row-span-2 row-start-4 col-start-4 bg-yellow-300 flex items-center justify-center">
            <TestCases tests={challenge.tests} />
          </div>
        </div>
      </div>
    </main>
  );
}
