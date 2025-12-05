import express from "express";
import {
  startTimer,
  pauseTimer,
  resumeTimer,
  getTimerStatus,
} from "../Controllers/timerController.js";
import { protect } from "../Controllers/authController.js";

const router = express.Router();
router.use(protect);

router.post("/tasks/:id/timer/start", startTimer);
router.post("/tasks/:id/timer/pause", pauseTimer);
router.post("/tasks/:id/timer/resume", resumeTimer);
router.get("/tasks/:id/timer/status", getTimerStatus);

export default router;
