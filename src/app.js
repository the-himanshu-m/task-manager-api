import express from "express";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import {
    notFound,
    errorHandler
} from "./middleware/errorMiddleware.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task Manager API is running"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Keep these after all routes
app.use(notFound);
app.use(errorHandler);

export default app;