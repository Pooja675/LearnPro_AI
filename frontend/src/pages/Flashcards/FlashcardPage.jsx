import React, { useState, useEffect } from "react"
import { useParams, Link  } from "react-router-dom"
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

import flashcardService from "../../services/flashcardService"
import aiService from "../../services/aiService"
import PageHeader from "../../components/common/PageHeader"
import Spinner from "../../components/common/Spinner"
import EmptyState from "../../components/common/EmptyState"
import Button from '../../components/common/Button'
import Modal from "../../components/common/Modal"
import Flashcard from "../../components/flashcards/Flashcard"


const FlashcardPage = () => {

    const { id: documentId } = useParams()
    const [  flashcardSets, setFlashcardSets ] = useState([])
    const [flashcards, setFlashcards] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const fetchFlashcards = async() => {
      setLoading(true);
      try {
        const response = await flashcardService.getFlashcardsForDocument(documentId)
        setFlashcardSets(response?.data[0])
        setFlashcards(response.data[0]?.cards || [])
      } catch (error) {
        toast.error("Failed to fetch flashcards.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchFlashcards()
    }, [documentId])

  const handleGenerateFlashcards = async () => {
      setGenerating(true)
      try {
        await aiService.generateFlashcards(documentId)
        toast.success("Flashcards generated successfully.")
        fetchFlashcards()
      } catch (error) {
        toast.error(error.message || "Failed to generate flashcards.")
      } finally {
        setGenerating(false)
      }
  }

  const handleNextCard = () => {
    handleReview(currentCardIndex)
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
  }

  const handlePrevCard = () => {
    handleReview(currentCardIndex)
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length )
  }

  const handleReview = async (cardIndex) => {
    const currentCard = flashcards[cardIndex];
    if (!currentCard) return;

    try {
        await flashcardService.reviewFlashcard(currentCard._id);  // ✅ just pass the card id
        toast.success("Flashcard Reviewed")
    } catch (error) {
        toast.error("Failed to review the flashcard.");
    }
};


const handleToggleStar = async (cardId) => {
  try {
    await flashcardService.toggleStar(cardId)
    setFlashcards((prevFlashcards) => 
      prevFlashcards.map((card) => 
        card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
      )
    )

    toast.success("Flashcard starred status updated!")
  } catch (error) {
    toast.error("Failed to update star status")
  }
}

const handleDeleteFlashcardSet = async () => {
  setDeleting(true)
  try {
    await flashcardService.deleteFlashcardSet(flashcardSets._id)
    toast.success("Flashcard set deleted successfully!")
    setIsDeleteModalOpen(false)
    fetchFlashcards()

  } catch (error) {
    toast.error(error.message || "Failed to delete the flashcard set.")
  } finally {
    setDeleting(false)
  }
}

const renderFlashcardContent = () => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spinner />
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <EmptyState
        title="No Flashcards Yet"
        description="Generate flashcards from your document to start learning."
      />
    )
  }

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className="flex flex-col items-center space-y-6 py-4"> {/* ✅ flex-col not flex-cols */}
      <div className="w-full max-w-2xl">
        <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={handlePrevCard}
          disabled={flashcards.length <= 1}
          className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium text-sm rounded-xl transition-all duration-150"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
          Previous
        </button>

        <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-sm font-semibold text-slate-700">
            {currentCardIndex + 1}{" "}
            <span className="text-slate-400 font-normal">/</span>{" "}
            {flashcards.length}
          </span>
        </div>

        <button
          onClick={handleNextCard}
          disabled={flashcards.length <= 1}
          className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium text-sm rounded-xl transition-all duration-150"
        >
          Next
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} /> {/* ✅ ChevronRight not ChevronLeft */}
        </button>
      </div>
    </div>
  )
}
  return (
  <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
    {/* Back Button */}
    <div>
      <Link
        to={`/documents/${documentId}`}
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2} />
        Back to Document
      </Link>
    </div>

    {/* Header */}
    <div className="flex items-center justify-between">
      <PageHeader title="Flashcards" />
      <div>
        {!loading && (
          flashcards.length > 0 ? (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-4 h-10 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed text-rose-600 font-semibold text-sm rounded-xl border border-rose-200 transition-all duration-150" // ✅ Red styling for Delete
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
              Delete Set
            </button>
          ) : (
            <button
              onClick={handleGenerateFlashcards}
              disabled={generating}
              className="group relative inline-flex items-center gap-2 px-5 h-11 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all duration-200 active:scale-95 overflow-hidden"
            >
              {generating ? (
                <Spinner />
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  Generate Flashcards
                </span>
              )}
            </button>
          )
        )}
      </div>
    </div>

    {renderFlashcardContent()}

    {/* Delete Modal */}
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      title="Confirm Delete Flashcard Set"
    >
      <div className="space-y-5">
        <p className="text-sm text-slate-600 leading-relaxed">
          Are you sure you want to delete all flashcards for this document?
          This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleting}
            className="px-4 h-10 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-medium text-sm rounded-xl transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteFlashcardSet}
            disabled={deleting}
            className="px-4 h-10 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-sm shadow-rose-500/25 transition-all duration-150"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  </div>
)
}

export default FlashcardPage



