import { useState } from "react";
import MonacoEditor from "@/components/features/editor/MonacoEditor";
import SettingsModal from "@/components/features/settings/SettingsModal";
import ChallengeCounter from "@/components/features/counter/ChallengeCounter";
import ProgressBar from "@/components/features/progress/ProgressBar";
import ChallengeCard from "@/components/features/challenges/ChallengeCard";

// Temporary mock categories (replace with real state from HomeContent)
const mockCategories = [
  { category: "Arrays", count: 10 },
  { category: "Strings", count: 8 },
];

const hardcodedChallenge = {
  id: 8,
  category: "dates",
  prompt:
    "Return true if sprint_deadline is tomorrow. Because Agile is just waterfall in disguise.",
  fn_name: "sprint_deadline",
  tests: [{ input: ["2025-09-28"], output: true }],
};

export default function GridLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const fetchChallenges = () => {
    console.log("Fetching challenges for:", selectedCategories);
  };

  return (
    <>
      <div className="grid grid-cols-10 grid-rows-9 gap-4 h-screen w-full p-4">
        {/* Button row spanning cols 1-4, aligned with row 1 */}
        <div className="col-span-4 row-start-1 flex gap-4">
          <button
            className="btn flex-1 h-full"
            onClick={() => setIsSettingsOpen(true)}
          >
            Settings
          </button>
          <button className="btn flex-1 h-full">Restart</button>
          <button className="btn flex-1 h-full">Skip</button>
          <button className="btn flex-1 h-full">Submit</button>
        </div>

        {/* Block 3: Challenge prompt */}
        <div className="col-span-4 row-span-4 col-start-1 row-start-2">
          <ChallengeCard
            title="Challenge"
            content={
              <>
                <p>
                  <strong>[{hardcodedChallenge.category}]</strong>{" "}
                  {hardcodedChallenge.prompt}
                </p>
                <p className="text-xs italic">
                  Function: <code>{hardcodedChallenge.fn_name}</code>
                </p>
              </>
            }
          />
        </div>

        {/* Block 4: Test cases */}
        <div className="col-span-4 row-span-4 col-start-1 row-start-6">
          <ChallengeCard
            title="Test Cases"
            content={
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(hardcodedChallenge.tests, null, 2)}
              </pre>
            }
          />
        </div>

        {/* Block 5: ChallengeCounter */}
        <div className="col-start-5 row-start-1">
          <ChallengeCounter completed={12} total={30} />
        </div>

        {/* Block 6: ProgressBar */}
        <div className="col-span-5 col-start-6 row-start-1">
          <ProgressBar />
        </div>

        {/* Block 7: MonacoEditor */}
        <div className="col-span-6 row-span-8 col-start-5 row-start-2">
          <MonacoEditor />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        categories={mockCategories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        fetchChallenges={fetchChallenges}
      />
    </>
  );
}
