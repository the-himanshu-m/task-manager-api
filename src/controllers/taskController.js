
import Task from "../models/Task.js";

const createTask = async (req, res) => {
    const task = await Task.create({
        ...req.body,
        user: req.user.id
    });

    return res.status(201).json({
        success: true,
        message: "Task created successfully",
        task
    });
};

const getTasks = async (req, res) => {
    const tasks = await Task.find({
        user: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: tasks.length,
        tasks
    });
};

const getTaskById = async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    return res.status(200).json({
        success: true,
        task
    });
};

const updateTask = async (req, res) => {
    const task = await Task.findOneAndUpdate(
        {
            _id: req.params.id,
            user: req.user.id
        },
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task
    });
};

const deleteTask = async (req, res) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        task
    });
};

export {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};