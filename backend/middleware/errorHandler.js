const errorHandler = (err, req, res, next) => {

    // ✅ Normalize non-standard errors into proper Error objects
    let normalizedError = err

    if (!(err instanceof Error)) {
        // Someone threw a string, plain object, or null
        normalizedError = new Error(
            typeof err === "string" ? err :
            err?.message ? err.message :
            "An unexpected error occurred"
        )
        normalizedError.statusCode = err?.statusCode || err?.status || 500
        console.error("NON-STANDARD ERROR RECEIVED:", err)  // log original
    }

    let statusCode = normalizedError.statusCode || normalizedError.status || 500
    let message = normalizedError.message || "Server Error"

    console.error("Error:", {
        name: normalizedError.name,
        message: normalizedError.message,
        code: normalizedError.code,
        http_code: normalizedError.http_code,
        stack: process.env.NODE_ENV === "development" 
            ? normalizedError.stack 
            : undefined,
    })

    // ✅ Mongoose bad ObjectId
    if (normalizedError.name === "CastError") {
        message = "Resource not found"
        statusCode = 404
    }

    // ✅ Mongoose duplicate key
    if (normalizedError.code === 11000) {
        const field = Object.keys(normalizedError.keyValue)[0]
        message = `${field} already exists`
        statusCode = 400
    }

    // ✅ Mongoose ValidationError
    if (normalizedError.name === "ValidationError") {
        message = Object.values(normalizedError.errors)
            .map(val => val.message)
            .join(", ")
        statusCode = 400
    }

    // ✅ Multer errors
    if (normalizedError.code === "LIMIT_FILE_SIZE") {
        message = "File size exceeds the maximum limit of 10MB"
        statusCode = 400
    }

    if (normalizedError.name === "MulterError") {
        message = normalizedError.message || "File upload error"
        statusCode = 400
    }

    // ✅ Cloudinary errors
    if (normalizedError.http_code) {
        message = normalizedError.message || "Cloudinary upload failed"
        statusCode = normalizedError.http_code
    }

    // ✅ JWT errors
    if (normalizedError.name === "JsonWebTokenError") {
        message = "Invalid token"
        statusCode = 401
    }

    if (normalizedError.name === "TokenExpiredError") {
        message = "Token expired"
        statusCode = 401
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode,
        ...(process.env.NODE_ENV === "development" && { 
            stack: normalizedError.stack 
        })
    })
}

export default errorHandler