"use client";
import { useState, useEffect } from "react";

interface Category {
  category: string;
  count: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  fetchChallenges: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  toggleCategory,
  fetchChallenges,
}: SettingsModalProps) {
  useEffect(() => {
    if (isOpen) {
      (document.getElementById("settings_modal") as HTMLDialogElement)?.showModal();
    } else {
      (document.getElementById("settings_modal") as HTMLDialogElement)?.close();
    }
  }, [isOpen]);

  return (
    <dialog id="settings_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Settings</h3>

        {/* Category selection */}
        <div className="space-y-2">
          <h4 className="font-semibold">Select Categories</h4>
          <div className="flex flex-wrap gap-3">
            {categories.map((c, idx) => (
              <label key={`${c.category}-${idx}`} className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox mr-2"
                  value={c.category}
                  checked={selectedCategories.includes(c.category)}
                  onChange={() => toggleCategory(c.category)}
                />
                {c.category} ({c.count})
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button className="btn btn-primary" onClick={fetchChallenges}>
            Load Challenges
          </button>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}