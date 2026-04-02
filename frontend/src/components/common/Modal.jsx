import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">

        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Card */}
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>

          {/* Title */}
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight pr-6">
              {title}
            </h3>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;