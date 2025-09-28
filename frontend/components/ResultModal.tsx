"use client";

import type { SubmitResponse } from "@/types/submit";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: SubmitResponse | null;
  loading: boolean; // 👈 new prop
}

export default function ResultModal({
  isOpen,
  onClose,
  results,
  loading,
}: ResultModalProps) {
  return (
    <>
      <input
        type="checkbox"
        id="result-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Submission Results</h3>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : results ? (
            results.status === "ok" ? (
              <pre className="bg-base-200 p-4 rounded-md overflow-x-auto text-sm">
                {JSON.stringify(results.results, null, 2)}
              </pre>
            ) : (
              <p className="text-red-500">{results.message}</p>
            )
          ) : (
            <p className="text-gray-500">No results available</p>
          )}

          <div className="modal-action">
            <button
              onClick={onClose}
              className="btn btn-primary"
              disabled={loading}
            >
              Ready for Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
