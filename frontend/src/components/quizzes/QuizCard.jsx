import React from 'react'
import { Link } from 'react-router-dom'
import { Play, BarChart2, Trash2, Award } from 'lucide-react'
import moment from 'moment'

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="group relative bg-white/80 backdrop-blur-xl border-2 border-slate-100 hover:border-indigo-400 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/10 cursor-pointer">

        {/* Delete Button */}
        <button
            onClick={(e) => { e.stopPropagation(); onDelete(quiz); }}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150"
        >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="space-y-4">
            {/* Score Badge */}
            <div className="flex items-center">
                <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold">
                    <Award className="w-3.5 h-3.5 text-indigo-600" strokeWidth={2.5} />
                    <span className="text-indigo-700">Score: {quiz?.score}</span>
                </div>
            </div>

            {/* Title & Date */}
            <div>
                <h3
                    className="text-base font-semibold text-slate-900 mb-1 line-clamp-2"
                    title={quiz.title}
                >
                    {quiz.title ||
                        `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`
                    }
                </h3>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Created {moment(quiz.createdAt).format("MMM D, YYYY")}
                </p>
            </div>

            {/* Quiz Info */}
            <div className="flex items-center gap-2">
                <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-sm">
                    <span className="text-xs font-medium text-slate-600">
                        {quiz.questions.length}{" "}
                        {quiz.questions.length === 1 ? "Question" : "Questions"}
                    </span>
                </div>
            </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
            {quiz?.userAnswers?.length > 0 ? (
                <Link to={`/quizzes/${quiz._id}/results`} className="block">
                    <button className="w-full inline-flex items-center justify-center gap-2 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 font-medium text-sm rounded-xl transition-all duration-150">
                        <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
                        View Results
                    </button>
                </Link>
            ) : (
                <Link to={`/quizzes/${quiz._id}`} className="block">
                    <button className="group/btn relative w-full inline-flex items-center justify-center gap-2 h-10 bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-150 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            <Play className="w-4 h-4" strokeWidth={2.5} />
                            Start Quiz
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                    </button>
                </Link>
            )}
        </div>
    </div>
  );
};

export default QuizCard