import Task from "../Models/Task.js";
import User from "../Models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createTask = catchAsync(async (req, res, next) => {
  const { title, description, assignee, status, priority } = req.body;

  if (!title) {
    return next(new AppError("Task title is required", 400));
  }

  if (!assignee) {
    return next(new AppError("Assignee is required", 400));
  }

  const assigneeUser = await User.findById(assignee);
  if (!assigneeUser) {
    return next(new AppError("Assignee user not found", 404));
  }

  const task = await Task.create({
    title,
    description,
    assignee,
    status: status || "pending",
    priority: priority || "medium",
    createdBy: req.user._id,
  });

  await task.populate("assignee", "name email role");
  await task.populate("createdBy", "name email role");

  res.status(201).json({
    status: "success",
    task,
  });
});

export const getAllTasks = catchAsync(async (req, res, next) => {
  const { status, assignee, priority } = req.query;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (assignee) {
    filter.assignee = assignee;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (req.user.role === "user") {
    filter.assignee = req.user._id;
  }

  const tasks = await Task.find(filter)
    .populate("assignee", "name email role")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  const tasksWithTimer = tasks.map((task) => {
    const taskObj = task.toObject();
    let currentElapsedTime = 0;
    if (task.timerState?.isRunning && task.timerState?.currentSessionStart) {
      currentElapsedTime =
        Date.now() - task.timerState.currentSessionStart.getTime();
    }
    taskObj.currentTotalTime = task.totalTrackedTime + currentElapsedTime;
    taskObj.totalTrackedTime = task.totalTrackedTime || 0;
    taskObj.timerState = task.timerState || {
      isRunning: false,
      currentSessionStart: null,
      lastPausedAt: null,
    };
    return taskObj;
  });

  res.status(200).json({
    status: "success",
    results: tasksWithTimer.length,
    tasks: tasksWithTimer,
  });
});

export const updateTask = catchAsync(async (req, res, next) => {
  const { title, description, assignee, status, priority } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (req.user.role !== "manager") {
    if (task.assignee.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You do not have permission to update this task", 403)
      );
    }

    if (title || description || assignee || priority) {
      return next(
        new AppError(
          "You can only update the status of tasks assigned to you",
          403
        )
      );
    }

    if (status) {
      task.status = status;
    }
  } else {
    if (assignee && assignee !== task.assignee.toString()) {
      const assigneeUser = await User.findById(assignee);
      if (!assigneeUser) {
        return next(new AppError("Assignee user not found", 404));
      }
    }

    if (title) {
      task.title = title;
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (assignee) {
      task.assignee = assignee;
    }
    if (status) {
      task.status = status;
    }
    if (priority) {
      task.priority = priority;
    }
  }

  await task.save();

  await task.populate("assignee", "name email role");
  await task.populate("createdBy", "name email role");

  res.status(200).json({
    status: "success",
    task,
  });
});

export const deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (req.user.role !== "manager") {
    return next(new AppError("Only managers can delete tasks", 403));
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
