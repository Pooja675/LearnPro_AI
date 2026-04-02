import fs from 'fs/promises'
import { PDFParse } from 'pdf-parse'

/**
 * Extract text from PDF file 
 * @param {string} filePath - path to PDF file
 * @returns {Promise<{text: string, numPages: number}>}
 */

export const extractTextFormPDF = async(filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath)
        //pdf-parser expects a Unit8Array, not a Buffer
        const parser = new PDFParse(new Uint8Array(dataBuffer))
        const data = await parser.getText()

        return {
            text: data.text,
            numPages: data.numPages,
            info: data.info,
        }
    } catch (error) {
        console.error("PDF parsing error", error);
        throw new Error("Failed to extract text from PDF")
    }
}