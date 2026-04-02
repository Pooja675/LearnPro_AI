import Document from "../models/Document.js"
import cloudinary from "../config/cloudinary.js";
import Flashcard from "../models/Flashcard.js"
import Quiz from "../models/Quiz.js"
import { extractTextFromPDF } from "../utils/pdfParser.js"
import { chunkText } from "../utils/textChunker.js"
import mongoose from "mongoose"


//Helper function to process PDF
const processPDF = async (documentId, cloudinaryUrl) => {  // ✅ renamed filePath → cloudinaryUrl
    try {
        // ✅ Now passes Cloudinary URL instead of local file path
        // Your updated pdfParser.js will fetch from this URL using fetch()
        const { text } = await extractTextFromPDF(cloudinaryUrl);

        const chunks = chunkText(text, 500, 50);

        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks: chunks,
            status: 'ready'
        });

        console.log(`Document ${documentId} processed successfully`);

    } catch (error) {
        console.error(`Error processing document ${documentId}:`, error);

        await Document.findByIdAndUpdate(documentId, {
            status: 'failed'
        });
    }
};

// @desc Upload PDF Document
// @route POST /api/documets/upload
// access Private
export const uploadDocument = async (req, res, next) => {
  try {
    // ✅ Check if file exists
    // multer-storage-cloudinary already uploaded it to Cloudinary at this point
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file",
        statusCode: 400,
      });
    }

    const { title } = req.body;

    // ✅ Check title
    // No need to delete local file on error — file is already on Cloudinary
    // So if title is missing, delete from Cloudinary instead
    if (!title) {
      // 🗑️ Remove the uploaded file from Cloudinary since upload is aborted
      await cloudinary.uploader.destroy(req.file.filename, {
        resource_type: "raw", // ✅ Must be "raw" for PDFs
      });

      return res.status(400).json({
        success: false,
        error: "Please provide a document title",
        statusCode: 400,
      });
    }

    // ✅ req.file now contains Cloudinary info (not local path)
    // req.file.path     → Cloudinary public URL  e.g. "https://res.cloudinary.com/..."
    // req.file.filename → Cloudinary public_id   e.g. "pdf_documents/userId_123_invoice"
    // req.file.size     → file size in bytes

    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      cloudinaryUrl: req.file.path,           // ✅ Real public URL, works everywhere
      cloudinaryPublicId: req.file.filename,  // ✅ Saved for deletion later
      fileSize: req.file.size,
      status: "processing",
    });

    // ✅ Pass Cloudinary URL to processPDF instead of local file path
    // processPDF should fetch PDF from this URL for text extraction
    processPDF(document._id, req.file.path).catch((err) => {
    console.error("PDF processing error:", err);
    // No need to update DB — processPDF catch block handles it already
});

    res.status(201).json({
      success: true,
      data: {
        _id: document._id,
        title: document.title,
        fileName: document.fileName,
        fileUrl: document.cloudinaryUrl,   // ✅ Return Cloudinary URL to frontend
        fileSize: document.fileSize,
        status: document.status,
        createdAt: document.createdAt,
      },
      message: "Document uploaded successfully. Processing in progress...",
    });

  } catch (error) {
    // ✅ If anything goes wrong, clean up Cloudinary
    // (no local file to delete anymore)
    console.error("FULL ERROR:", error) 
    if (req.file) {
      await cloudinary.uploader
        .destroy(req.file.filename, {
          resource_type: "raw",
        })
        .catch((err) => {
          console.error("Cloudinary cleanup failed:", err);
        });
    }

    next(error);
  }
};



// @desc Get all user documents
// @route GET /api/documents
// access Private

export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.aggregate([
          {
            $match: {userId: new mongoose.Types.ObjectId(req.user._id)}
          },
          {
            $lookup: {
              from: 'flashcards',
              localField: '_id',
              foreignField: 'documentId',
              as: 'flashcardSets'
            }
          },
          {
            $lookup: {
              from: 'quizzes',
              localField: '_id',
              foreignField: 'documentId',
              as: 'quizzes'
            }
          }, 
          {
            $addFields: {
              flashcardCount: {$size: '$flashcardSets'},
              quizCount: { $size: '$quizzes'}
            }
          },
          {
            $project: {
              extractedText: 0,
              chunks: 0,
              flashcardSets: 0,
              quizzes: 0
            }
          },
          {
            $sort: { uploadDate: -1}
          }
        ])

        res.status(200).json({
          success: true,
          count: documents.length,
          data: documents
        })
    } catch (error) {
        next(error)
    }
}

// @desc Get single document with chunk
// @route GET /api/documents/:id
// access Private

export const getDocument = async (req, res, next) => {
     try {
        const document = await Document.findOne({
          _id: req.params.id,
          userId: req.user._id
        })

        if(!document) {
          return res.status(404).json({
            success: false,
            error: 'Document not found',
            statusCode: 404
          })
        }

        // Get counts of associated flashcards and quizzes
        const flashcardCount = await Flashcard.countDocuments({ documentId: document._id, userId: req.user._id })
        const quizCount = await Quiz.countDocuments({ documentId: document._id, userId: req.user._id })

        // Update last accessed
        document.lastAccessed = Date.now();
        await document.save()

        // Combine document data with counts
        const documentData = document.toObject()
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount;

        res.status(200).json({
          success: true,
          data: documentData
        })
    } catch (error) {
        next(error)
    }
}

// @desc Delete document
// @route DELETE /api/documents/:id
// access Private

export const deleteDocument = async (req, res, next) => {
    try {
        // ✅ Fixed: req.params.id not req.params._id
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id    // ✅ Ensures user can only delete their own docs
        })

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found",
                statusCode: 404
            })
        }

        // ✅ Delete from Cloudinary instead of local filesystem
        await cloudinary.uploader.destroy(document.cloudinaryPublicId, {
            resource_type: "raw"    // ✅ Must match how it was uploaded
        }).catch((err) => {
            console.error("Cloudinary delete failed:", err)
            // ✅ Don't throw — still delete from MongoDB even if Cloudinary fails
        })

        // ✅ Fixed: deleteOne() not findOne()
        await document.deleteOne()

        res.status(200).json({
            success: true,
            message: "Document deleted successfully."
        })

    } catch (error) {
        next(error)
    }
}




