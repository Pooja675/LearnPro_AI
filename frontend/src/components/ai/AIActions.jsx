import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRender";
import Modal from "../common/Modal";

const AIActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");

    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModalTitle("Generated Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter the concept to explain.");
      return;
    }

    setLoadingAction("explain");

    try {
      const { explaination } = await aiService.explainConcept(
        documentId,
        concept,
      );
      setModalTitle(`Explaination of "${concept}"`);
      setModalContent(explaination);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain the concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                AI Assistant
              </h3>
              <p className="text-xs text-slate-500">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        {/* Actions List */}
        <div className="p-6 space-y-6">
          {/* Generate Summary */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-2xl border border-slate-200/60 hover:border-slate-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <BookOpen
                      className="w-4 h-4 text-indigo-500"
                      strokeWidth={2}
                    />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Generate Summary
                  </h4>
                </div>
                <p className="text-xs font-semibold text-slate-500 ml-9">
                  Get a concise summary of the entire document.
                </p>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className="shrink-0 px-5 py-2 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loadingAction === "summary" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Summarize"
                )}
              </button>
            </div>
          </div>

          {/* Explain Concept */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-2xl border border-slate-200/60 hover:border-slate-300 hover:shadow-md transition-all duration-200">
            <form onSubmit={handleExplainConcept}>
              {/* Title Row */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <Lightbulb
                    className="w-4 h-4 text-amber-500"
                    strokeWidth={2}
                  />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Explain a Concept
                </h4>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 mb-4 ml-9">
                Enter a topic or concept from the document to get a detailed
                explanation.
              </p>

              {/* Input + Button Row */}
              <div className="flex items-center gap-2 ml-9">
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g., React Components"
                  className="flex-1 h-9 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loadingAction === "explain"}
                />
                <button
                  type="submit"
                  disabled={loadingAction === "explain" || !concept.trim()}
                  className="shrink-0 px-4 h-9 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loadingAction === "explain" ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Explain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() =>setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate">
            <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AIActions;
