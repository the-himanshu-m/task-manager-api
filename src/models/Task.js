
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        },

        subject: {
            type: String,
            trim: true,
            default: "General"
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },

        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending"
        },

        dueDate: {
            type: Date,
            default: null
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;