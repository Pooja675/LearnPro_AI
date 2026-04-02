import express from "express";
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument
} from "../controllers/documentController.js"

import protect from "../middleware/auth.js";
import {upload} from "../config/multer.js"

const router = express.Router();

//All routes are protected
router.use(protect)

const uploadMiddleware = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            console.error("MULTER RAW ERROR:", err)
            return next(err)  // ✅ Forwards to errorHandler correctly
        }
        next()
    })
}

router.post("/upload", protect, uploadMiddleware, uploadDocument)
router.get('/', protect, getDocuments)
router.get('/:id', getDocument)
router.delete("/:id", deleteDocument)


export default router;