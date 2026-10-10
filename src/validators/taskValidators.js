
import mongoose from "mongoose";

const allowedFields = [
    "title",
    "description",
    "subject",
    "priority",
    "status",
    "dueDate"
];

const validPriorities = ["low", "medium", "high"];
const validStatuses = ["pending", "in-progress", "completed"];

const validateTaskBody = ({ partial = false } = {}) => {
    return (req, res, next) => {
        const body = req.body;

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return res.status(400).json({
                success: false,
                message: "Request body must be a JSON object"
            });
        }

        const fields = Object.keys(body);

        if (fields.some((field) => !allowedFields.includes(field))) {
            return res.status(400).json({
                success: false,
                message: "Request contains unsupported fields"
            });
        }

        if (!partial && !Object.hasOwn(body, "title")) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (partial && fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update"
            });
        }

        if (Object.hasOwn(body, "title")) {
            if (
                typeof body.title !== "string" ||
                !body.title.trim() ||
                body.title.trim().length > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Title must be a non-empty string of at most 100 characters"
                });
            }

            body.title = body.title.trim();
        }

        if (Object.hasOwn(body, "description")) {
            if (
                typeof body.description !== "string" ||
                body.description.length > 1000
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Description must be a string of at most 1000 characters"
                });
            }
        }

        if (Object.hasOwn(body, "subject")) {
            if (
                typeof body.subject !== "string" ||
                !body.subject.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Subject must be a non-empty string"
                });
            }

            body.subject = body.subject.trim();
        }

        if (
            Object.hasOwn(body, "priority") &&
            !validPriorities.includes(body.priority)
        ) {
            return res.status(400).json({
                success: false,
                message: "Priority must be low, medium, or high"
            });
        }

        if (
            Object.hasOwn(body, "status") &&
            !validStatuses.includes(body.status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Status must be pending, in-progress, or completed"
            });
        }

        if (Object.hasOwn(body, "dueDate")) {
            const date = body.dueDate;

            if (
                date !== null &&
                (
                    typeof date !== "string" ||
                    !date.trim() ||
                    Number.isNaN(Date.parse(date))
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "dueDate must be a valid date string or null"
                });
            }
        }

        next();
    };
};

const validateTaskId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid task ID"
        });
    }

    next();
};

export { validateTaskBody, validateTaskId };