import express from "express";
import authRoutes from "./auth/authRoutes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        "message" : "Task manager API is running"
    });
});

export default app;