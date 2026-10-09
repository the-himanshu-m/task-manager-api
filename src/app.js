import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());

app.use("api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.json({
        "message" : "Task manager API is running"
    });
});

export default app;