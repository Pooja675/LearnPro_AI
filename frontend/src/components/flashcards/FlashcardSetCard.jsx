import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react'
import moment from 'moment'
 
const FlashcardSetCard = ({flashcardSet}) => {

    const navigate = useNavigate();

    const handleStudyNow = () => {
        navigate(`/documents/${flashcardSet.documentId._id}/flashcards`)
    }

    const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
    const totalCards = flashcardSet.cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
   <div
    className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
    onClick={handleStudyNow}
>
    <div className="p-5 space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600" strokeWidth={2} />
            </div>
            <div className="min-w-0">
                <h3
                    className="text-sm font-semibold text-slate-900 truncate"
                    title={flashcardSet?.documentId?.title}
                >
                    {flashcardSet?.documentId?.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wide font-medium">
                    Created {moment(flashcardSet.createdAt).fromNow()}
                </p>
            </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
                <span className="text-xs font-semibold text-slate-600">
                    {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
                </span>
            </div>
            {reviewedCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" strokeWidth={2.5} />
                    <span className="text-xs font-semibold text-indigo-700">
                        {progressPercentage}%
                    </span>
                </div>
            )}
        </div>

        {/* Progress bar */}
        {totalCards > 0 && (
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                        Progress
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                        {reviewedCount} / {totalCards} reviewed
                    </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        )}
    </div>

    {/* Study Button */}
    <div className="px-5 pb-5">
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleStudyNow();
            }}
            className="group relative w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/25 active:scale-95 overflow-hidden"
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                Study Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
    </div>
</div>
  )
}

export default FlashcardSetCard