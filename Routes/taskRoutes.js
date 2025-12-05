import express from "express";
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../Controllers/taskController.js";
import { protect, restrictTo } from "../Controllers/authController.js";

const router = express.Router();
router.use(protect);

router.get("/alltasks", getAllTasks);
router.post("/createtask", restrictTo("manager"), createTask);

router.patch("/updatetask/:id", updateTask);
router.delete("/deletetask/:id", restrictTo("manager"), deleteTask);

export default router;
