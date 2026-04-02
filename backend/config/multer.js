// config/multerCloudinary.js
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import cloudinary from "./cloudinary.js"

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {

        // ✅ Add this debug log
        console.log("UPLOAD ATTEMPT - Cloudinary config at upload time:", {
            cloud_name: cloudinary.config().cloud_name,
            api_key: cloudinary.config().api_key,
            has_secret: !!cloudinary.config().api_secret
        })

        const userId = req.user?._id || "unknown"
        const name = file.originalname.replace(".pdf", "").replace(/\s+/g, "_")

        return {
            folder: "pdf_documents",
            resource_type: "raw",
            allowed_formats: ["pdf"],
            public_id: `${userId}_${Date.now()}_${name}`,
        }
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true)
    } else {
        cb(new Error("Only PDF files are allowed"), false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
})