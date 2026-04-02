import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Replaces moment.js — no extra dependency needed
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year",   seconds: 31536000 },
    { label: "month",  seconds: 2592000  },
    { label: "week",   seconds: 604800   },
    { label: "day",    seconds: 86400    },
    { label: "hour",   seconds: 3600     },
    { label: "minute", seconds: 60       },
    { label: "second", seconds: 1        },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); 
    onDelete(document);
  };

  return (
    <div
      className="relative bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col gap-4"
      onClick={handleNavigate}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold text-slate-800 truncate"
        title={document.title}
      >
        {document.title}
      </h3>

      {/* Document Info */}
      <div className="flex items-center gap-1">
        {document.fileSize !== undefined && (
          <span className="text-xs text-slate-400">
            {formatFileSize(document.fileSize)}
          </span>
        )}
      </div>

      {/* Stats Section */}
      <div className="flex items-center gap-2 flex-wrap">
        {document.flashcardCount !== undefined && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
            <BookOpen className="w-3 h-3" strokeWidth={2} />
            <span>{document.flashcardCount} Flashcards</span> {/* ✅ Fixed typo: flashcardCountCount → flashcardCount */}
          </div>
        )}
        {document.quizCount !== undefined && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">
            <BrainCircuit className="w-3 h-3" strokeWidth={2} />
            <span>{document.quizCount} Quizzes</span>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="border-t border-slate-100 pt-3 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3 h-3" strokeWidth={2} />
          <span>Uploaded {timeAgo(document.createdAt)}</span> {/* ✅ Replaced moment() with timeAgo() */}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-b-2xl opacity-0 hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default DocumentCard;