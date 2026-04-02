// pdfParser.js
import { PDFParse } from 'pdf-parse'

/**
 * Extract text from PDF file
 * @param {string} fileUrl - Cloudinary URL to PDF file (not local path anymore)
 * @returns {Promise<{text: string, numPages: number}>}
 */

export const extractTextFromPDF = async (fileUrl) => {
    try {
        // ✅ Fetch PDF from Cloudinary URL instead of reading local file
        // No more fs.readFile() needed
        const response = await fetch(fileUrl)

        if(!response.ok){
            throw new Error(`Failed to fetch PDF from Cloudinary: ${response.statusText}`)
        }

        // ✅ Convert response to buffer
        const arrayBuffer = await response.arrayBuffer()
        const dataBuffer = Buffer.from(arrayBuffer)

        // pdf-parser expects a Uint8Array, not a Buffer
        const parser = new PDFParse(new Uint8Array(dataBuffer))
        const data = await parser.getText()

        return {
            text: data.text,
            numPages: data.numPages,
            info: data.info,
        }

    } catch (error) {
        console.error("PDF parsing error", error)
        throw new Error("Failed to extract text from PDF")
    }
}