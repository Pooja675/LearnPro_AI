import React, { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false); // ✅ fixed

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full h-72" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front of the card (Question) */}
        <div
          className="absolute inset-0 w-full h-full bg-white/80 backdrop-blur-xl border-2 border-slate-100 rounded-2xl p-6 flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Star Button Row */}
          <div className="flex items-start justify-between">
            <div className="bg-slate-100 text-[10px] text-slate-600 rounded px-4 py-1 uppercase tracking-wide font-medium">
              {flashcard?.dfficulty}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-linear-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-lg font-semibold text-slate-800 text-center leading-relaxed">
              {flashcard.question}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="text-xs">Click to reveal answer</span>
          </div>
        </div>

        {/* Back of the card (Answers) */}

        <div
          className="absolute inset-0 w-full h-full bg-linear-to-br from-indigo-400 to-indigo-600 rounded-2xl p-6 flex flex-col shadow-xl shadow-indigo-500/25"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Star Button Row */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-white/30 backdrop-blur-sm text-white border border-white/40"
                  : "bg-white/20 backdrop-blur-sm text-white/70 hover:bg-white/30 hover:text-white border border-white/40"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Answer Content */}
          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-base font-medium text-white text-center leading-relaxed">
              {flashcard.answer}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-white/60">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="text-xs">Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
