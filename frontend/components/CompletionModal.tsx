"use client";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  completed: number;
  total: number;
  timeLeft: number;
  reason: "timeout" | "finished";
}

export default function CompletionModal({
  isOpen,
  onClose,
  completed,
  total,
  timeLeft,
  reason,
}: CompletionModalProps) {
  return (
    <>
      <input
        type="checkbox"
        id="completion-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box max-w-md text-center">
          <h3 className="font-bold text-lg mb-4">
            {reason === "timeout" ? "⏱️ Time’s Up!" : "🎉 All Done!"}
          </h3>

          <p className="mb-4">
            You completed <span className="font-bold">{completed}</span> out of{" "}
            <span className="font-bold">{total}</span> challenges.
          </p>

          <p className="mb-6">
            Time left: <span className="badge badge-primary">{timeLeft}s</span>
          </p>

          <p>You need to refresh the page to play again.</p>

          <div className="modal-action flex justify-center">
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
