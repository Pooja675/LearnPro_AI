import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizeService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fecthResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
          console.log(data)

        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fecthResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "OutStanding!";
    if (score >= 80) return "Great Job!";
    if (score >= 70) return "Good Work!";
    if (score >= 60) return "Not bad!";
    return "Keep Practicing";
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to={`/documents/${quiz.document._id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || "Quiz"} Results`} />

      {/* Score Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          {/* Trophy Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 mb-2">
            <Trophy className="w-8 h-8 text-emerald-600" strokeWidth={2} />
          </div>

          {/* Score */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Your Score
            </p>
            <div
              className={`text-6xl font-bold bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}
            >
              {score}%
            </div>
          </div>

          {/* Message */}
          <p className="text-sm font-semibold text-slate-500">
            {getScoreMessage(score)}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-3 pt-5 border-slate-100">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full">
            <Target className="w-4 h-4 text-slate-500" strokeWidth={2} />
            <span className="text-sm font-semibold text-slate-600">
              {totalQuestions} Total
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
            <CheckCircle2
              className="w-4 h-4 text-emerald-600"
              strokeWidth={2}
            />
            <span className="text-sm font-semibold text-emerald-700">
              {correctAnswers} Correct
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-full">
            <XCircle className="w-4 h-4 text-rose-600" strokeWidth={2} />
            <span className="text-sm font-semibold text-rose-700">
              {incorrectAnswers} Incorrect
            </span>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6 mt-8">
        {/* Section Header */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-600" strokeWidth={2} />
          <h3 className="text-lg font-semibold text-slate-900">
            Detailed Review
          </h3>
        </div>

        {detailedResults.map((result, index) => {
          const userAnswerIndex = result.options.findIndex(
            (opt) => opt === result.selectedAnswer,
          );

          // ✅ Fixed: use result.correctAnswer (not result.correctAnswers) with safe optional chaining
          const correctAnswersIndex = result.correctAnswer?.startsWith?.("0")
            ? parseInt(result.correctAnswer.substring(1)) - 1
            : result.options.findIndex((opt) => opt === result.correctAnswer);

          const isCorrect = result.isCorrect;

          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Question {index + 1}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 leading-snug">
                    {result.question}
                  </h4>
                </div>
                <div
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCorrect
                      ? "bg-emerald-50 border-2 border-emerald-200"
                      : "bg-rose-50 border-2 border-rose-200"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-600"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <XCircle
                      className="w-5 h-5 text-rose-500"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {result.options.map((option, optIndex) => {
                  const isCorrectOption = optIndex === correctAnswersIndex;
                  const isUserAnswer = optIndex === userAnswerIndex;
                  const isWrongAnswer = isUserAnswer && !isCorrect;

                  return (
                    <div
                      key={optIndex}
                      className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isCorrectOption
                          ? "bg-emerald-50 border-emerald-300 shadow-sm shadow-emerald-500/10"
                          : isWrongAnswer
                            ? "bg-rose-50 border-rose-300"
                            : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-sm font-medium ${
                            isCorrectOption
                              ? "text-emerald-800"
                              : isWrongAnswer
                                ? "text-rose-900"
                                : "text-slate-700"
                          }`}
                        >
                          {option}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {isCorrectOption && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                              <CheckCircle2
                                className="w-3.5 h-3.5"
                                strokeWidth={2.5}
                              />
                              Correct
                            </span>
                          )}
                          {isWrongAnswer && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                              <XCircle
                                className="w-3.5 h-3.5"
                                strokeWidth={2.5}
                              />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                      <BookOpen
                        className="w-4 h-4 text-slate-600"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Explanation
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <Link to={`/documents/${quiz.document._id}`}>
        <button className="group relative px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 overflow-hidden">
          <span className="relative z-10 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2.5} />
            Return to Document
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -transalte-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;
