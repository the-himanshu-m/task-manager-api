
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
    const {
        status,
        priority,
        subject,
        search,
        page: pageQuery = "1",
        limit: limitQuery = "10",
        sortBy = "createdAt",
        order = "desc"
    } = req.query;

    // Validate pagination parameters
    if (
        typeof pageQuery !== "string" ||
        !/^\d+$/.test(pageQuery) ||
        Number(pageQuery) < 1 ||
        typeof limitQuery !== "string" ||
        !/^\d+$/.test(limitQuery) ||
        Number(limitQuery) < 1 ||
        Number(limitQuery) > 100
    ) {
        return res.status(400).json({
            success: false,
            message: "Page must be positive and limit must be between 1 and 100"
        });
    }

    const allowedStatuses = [
        "pending",
        "in-progress",
        "completed"
    ];

    const allowedPriorities = ["low", "medium", "high"];

    const allowedSortFields = [
        "createdAt",
        "dueDate",
        "title",
        "priority",
        "status"
    ];

    if (
        status !== undefined &&
        (typeof status !== "string" || !allowedStatuses.includes(status))
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid status filter"
        });
    }

    if (
        priority !== undefined &&
        (typeof priority !== "string" ||
            !allowedPriorities.includes(priority))
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid priority filter"
        });
    }

    if (
        (subject !== undefined &&
            (typeof subject !== "string" || !subject.trim())) ||
        (search !== undefined && typeof search !== "string")
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid subject or search parameter"
        });
    }

    if (
        !allowedSortFields.includes(sortBy) ||
        !["asc", "desc"].includes(order)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid sorting options"
        });
    }

    const page = Number(pageQuery);
    const limit = Number(limitQuery);
    const skip = (page - 1) * limit;

    // Every query is restricted to the logged-in user
    const filter = {
        user: req.user.id
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (subject) {
        filter.subject = subject.trim();
    }

    if (search && search.trim()) {
        const escapedSearch = search.trim().replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        filter.title = {
            $regex: escapedSearch,
            $options: "i"
        };
    }

    const sort = {
        [sortBy]: order === "asc" ? 1 : -1
    };

    const [tasks, totalTasks] = await Promise.all([
        Task.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit),

        Task.countDocuments(filter)
    ]);

    return res.status(200).json({
        success: true,
        pagination: {
            page,
            limit,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit)
        },
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


const getTaskStats = async (req, res) => {
    const userFilter = {
        user: req.user.id
    };

    const [total, pending, inProgress, completed] =
        await Promise.all([
            Task.countDocuments(userFilter),

            Task.countDocuments({
                ...userFilter,
                status: "pending"
            }),

            Task.countDocuments({
                ...userFilter,
                status: "in-progress"
            }),

            Task.countDocuments({
                ...userFilter,
                status: "completed"
            })
        ]);

    return res.status(200).json({
        success: true,
        stats: {
            total,
            pending,
            inProgress,
            completed
        }
    });
};


export {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats
};