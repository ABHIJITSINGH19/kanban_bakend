import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a task title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please assign the task to a user"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    totalTrackedTime: {
      type: Number,
      default: 0,
    },
    timerState: {
      isRunning: {
        type: Boolean,
        default: false,
      },
      currentSessionStart: {
        type: Date,
        default: null,
      },
      lastPausedAt: {
        type: Date,
        default: null,
      },
    },
    timeTrackingHistory: [
      {
        startTime: Date,
        endTime: Date,
        duration: Number,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ createdBy: 1 });

export default mongoose.model("Task", taskSchema);
