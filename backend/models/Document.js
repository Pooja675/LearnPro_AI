import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    pageNumber: {
        type: Number,   // ✅ Fixed: was String
        default: 0,
    },
    chunkIndex: {
        type: Number,
        required: true,
    },
}, { _id: false });  // ✅ Saves storage — chunks don't need their own _id


const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Please provide a document title"], 
        trim: true,
    },
    fileName: {
        type: String,
        required: true,
    },

    
    cloudinaryUrl: {
        type: String,
        required: true,         // Public URL to access/download PDF
    },
    cloudinaryPublicId: {
        type: String,
        required: true,         // Required to delete file from Cloudinary
    },

    fileSize: {
        type: Number,
        required: true,
    },
    extractedText: {
        type: String,
        default: "",
    },
    chunks: [chunkSchema],
    uploadDate: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now,      
    },
    status: {
        type: String,
        enum: ["processing", "ready", "failed"],
        default: "processing",
    },
}, {
    timestamps: true,          
                                
});

// ✅ Updated index — use createdAt instead of uploadDate
documentSchema.index({ userId: 1, createdAt: -1 });

// ✅ Auto-update lastAccessed when document is queried
documentSchema.methods.updateLastAccessed = async function () {
    this.lastAccessed = new Date();
    await this.save();
};

const Document = mongoose.model("Document", documentSchema);

export default Document;