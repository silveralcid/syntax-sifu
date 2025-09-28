"use client";

import { useEffect, useState } from "react";

import { Challenge } from "@/types/challenge";

interface Category {
  category: string;
  count: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (challenges: Challenge[]) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onLoad,
}: SettingsModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Error fetching categories", err));
    }
  }, [isOpen]);

  const toggleCategory = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleLoad = async () => {
    if (!selected.length) return;

    setLoading(true);
    try {
      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/challenges?category=${selected.join(",")}`;
      const res = await fetch(url);
      const data = await res.json();
      onLoad(data);
      onClose();
    } catch (err) {
      console.error("Error fetching challenges", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="settings-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box w-96 max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Select Categories</h3>

          <div className="flex flex-col gap-2 mb-6">
            {categories.map((cat) => (
              <label
                key={cat.category}
                className="label cursor-pointer justify-between"
              >
                <span className="label-text">
                  {cat.category}{" "}
                  <span className="text-xs text-gray-400">({cat.count})</span>
                </span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selected.includes(cat.category)}
                  onChange={() => toggleCategory(cat.category)}
                />
              </label>
            ))}
          </div>

          <div className="modal-action flex justify-between">
            <button onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              onClick={handleLoad}
              disabled={loading || !selected.length}
              className={`btn btn-primary ${loading ? "loading" : ""}`}
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
