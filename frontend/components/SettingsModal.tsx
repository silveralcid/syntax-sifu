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

  const [shuffle, setShuffle] = useState(true);
  const [limit, setLimit] = useState(0);

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
      }/challenges?category=${selected.join(
        ","
      )}&limit=${limit}&shuffle=${shuffle}`;
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

          {/* Category checkboxes */}
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

          {/* Shuffle toggle */}
          <div className="form-control mb-4">
            <label className="label cursor-pointer justify-between">
              <span className="label-text">Shuffle challenges</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={shuffle}
                onChange={() => setShuffle((s) => !s)}
              />
            </label>
          </div>

          {/* Limit input */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Limit (0 = all)</span>
            </label>
            <input
              type="number"
              min={0}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="input input-bordered w-full"
            />
          </div>

          {/* Action buttons */}
          <div className="modal-action flex justify-between items-center w-full">
            <button onClick={onClose} className="btn btn-outline">
              Cancel
            </button>

            <div className="flex gap-2">
              {/* Wake Up button */}
              <a
                href="https://syntax-sifu.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Wake Up, Sifu.
              </a>

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
      </div>
    </>
  );
}
