const notFound = (req, res, next) => {
    const error = new Error(
        `Route not found: ${req.method} ${req.originalUrl}`
    );

    error.statusCode = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    // Malformed JSON
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        statusCode = 400;
        message = "Invalid JSON in request body";
    }

    // Mongoose validation error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed";
    }

    // Invalid database value or ObjectId cast
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid data format";
    }

    // Duplicate unique-index value
    else if (err.code === 11000) {
        statusCode = 409;
        message = "A record with that value already exists";
    }

    // Hide internal error details from clients in production
    if (statusCode >= 500) {
        message = "Internal server error";
    }

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== "production" &&
        statusCode >= 500
            ? { debug: err.message }
            : {})
    });
};

export { notFound, errorHandler };
