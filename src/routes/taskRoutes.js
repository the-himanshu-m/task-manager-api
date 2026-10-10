import express from "express";
import authenticateUser from "../middleware/authMiddleware.js";
import {
    validateTaskBody,
    validateTaskId
} from "../validators/taskValidators.js";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

router.use(authenticateUser);

router.post(
    "/",
    validateTaskBody(),
    createTask
);

router.get(
    "/",
    getTasks
);

router.get(
    "/:id",
    validateTaskId,
    getTaskById
);

router.patch(
    "/:id",
    validateTaskId,
    validateTaskBody({ partial: true }),
    updateTask
);

router.delete(
    "/:id",
    validateTaskId,
    deleteTask
);

export default router;