import { useState } from "react";
import MonacoEditor from "@/components/features/editor/MonacoEditor";
import SettingsModal from "@/components/features/settings/SettingsModal";

// Temporary mock categories (replace with real state from HomeContent)
const mockCategories = [
  { category: "Arrays", count: 10 },
  { category: "Strings", count: 8 },
];

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

        <div className="card col-span-4 row-span-4 col-start-1 row-start-2">
          <div className="card-body flex items-center justify-center">3</div>
        </div>
        <div className="card col-span-4 row-span-4 col-start-1 row-start-6">
          <div className="card-body flex items-center justify-center">4</div>
        </div>

        {/* Keep blocks 5 and 6 aligned in row 1 on the right */}
        <div className="card col-start-5 row-start-1">
          <div className="card-body flex items-center justify-center">5</div>
        </div>
        <div className="card col-span-5 col-start-6 row-start-1">
          <div className="card-body flex items-center justify-center">6</div>
        </div>

        <div className="card col-span-6 row-span-8 col-start-5 row-start-2">
          <div className="card-body p-0">
            <MonacoEditor />
          </div>
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