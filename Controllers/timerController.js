import Task from "../Models/Task.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const autoPauseRunningTimers = async (userId, excludeTaskId = null) => {
  const filter = {
    "timerState.isRunning": true,
    assignee: userId,
  };

  if (excludeTaskId) {
    filter._id = { $ne: excludeTaskId };
  }

  const runningTasks = await Task.find(filter);

  for (const task of runningTasks) {
    if (task.timerState.currentSessionStart) {
      const elapsedTime =
        Date.now() - task.timerState.currentSessionStart.getTime();
      task.totalTrackedTime += elapsedTime;

      task.timeTrackingHistory.push({
        startTime: task.timerState.currentSessionStart,
        endTime: new Date(),
        duration: elapsedTime,
        userId: userId,
      });

      task.timerState.isRunning = false;
      task.timerState.currentSessionStart = null;
      task.timerState.lastPausedAt = new Date();
      await task.save();
    }
  }
};

export const startTimer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const task = await Task.findById(id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (task.assignee.toString() !== userId.toString()) {
    return next(
      new AppError("You can only start timer for tasks assigned to you", 403)
    );
  }

  await autoPauseRunningTimers(userId, id);

  task.timerState.isRunning = true;
  task.timerState.currentSessionStart = new Date();
  task.timerState.lastPausedAt = null;
  await task.save();

  await task.populate("assignee", "name email role");
  await task.populate("createdBy", "name email role");

  const taskObj = task.toObject();
  let currentElapsedTime = 0;
  if (task.timerState?.isRunning && task.timerState?.currentSessionStart) {
    currentElapsedTime =
      Date.now() - task.timerState.currentSessionStart.getTime();
  }
  taskObj.currentTotalTime = task.totalTrackedTime + currentElapsedTime;

  res.status(200).json({
    status: "success",
    message: "Timer started successfully",
    task: taskObj,
  });
});

export const pauseTimer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const task = await Task.findById(id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (task.assignee.toString() !== userId.toString()) {
    return next(
      new AppError("You can only pause timer for tasks assigned to you", 403)
    );
  }

  if (!task.timerState.isRunning) {
    return next(new AppError("Timer is not running", 400));
  }

  const elapsedTime =
    Date.now() - task.timerState.currentSessionStart.getTime();
  task.totalTrackedTime += elapsedTime;

  task.timeTrackingHistory.push({
    startTime: task.timerState.currentSessionStart,
    endTime: new Date(),
    duration: elapsedTime,
    userId: userId,
  });

  task.timerState.isRunning = false;
  task.timerState.currentSessionStart = null;
  task.timerState.lastPausedAt = new Date();
  await task.save();

  await task.populate("assignee", "name email role");
  await task.populate("createdBy", "name email role");

  const taskObj = task.toObject();
  taskObj.currentTotalTime = task.totalTrackedTime;

  res.status(200).json({
    status: "success",
    message: "Timer paused successfully",
    task: taskObj,
  });
});

export const resumeTimer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const task = await Task.findById(id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (task.assignee.toString() !== userId.toString()) {
    return next(
      new AppError("You can only resume timer for tasks assigned to you", 403)
    );
  }

  if (task.timerState.isRunning) {
    return next(new AppError("Timer is already running", 400));
  }

  await autoPauseRunningTimers(userId, id);

  task.timerState.isRunning = true;
  task.timerState.currentSessionStart = new Date();
  task.timerState.lastPausedAt = null;
  await task.save();

  await task.populate("assignee", "name email role");
  await task.populate("createdBy", "name email role");

  const taskObj = task.toObject();
  let currentElapsedTime = 0;
  if (task.timerState?.isRunning && task.timerState?.currentSessionStart) {
    currentElapsedTime =
      Date.now() - task.timerState.currentSessionStart.getTime();
  }
  taskObj.currentTotalTime = task.totalTrackedTime + currentElapsedTime;

  res.status(200).json({
    status: "success",
    message: "Timer resumed successfully",
    task: taskObj,
  });
});

export const getTimerStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const task = await Task.findById(id).select(
    "totalTrackedTime timerState timeTrackingHistory assignee"
  );

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  if (!task.assignee) {
    return next(new AppError("Task has no assignee", 400));
  }

  if (task.assignee.toString() !== userId.toString()) {
    return next(
      new AppError("You can only view timer for tasks assigned to you", 403)
    );
  }

  let currentElapsedTime = 0;
  if (task.timerState.isRunning && task.timerState.currentSessionStart) {
    currentElapsedTime =
      Date.now() - task.timerState.currentSessionStart.getTime();
  }

  const totalTime = task.totalTrackedTime + currentElapsedTime;

  res.status(200).json({
    status: "success",
    timer: {
      totalTrackedTime: task.totalTrackedTime,
      currentElapsedTime,
      totalTime,
      isRunning: task.timerState.isRunning,
      currentSessionStart: task.timerState.currentSessionStart,
      lastPausedAt: task.timerState.lastPausedAt,
      history: task.timeTrackingHistory,
    },
  });
});
