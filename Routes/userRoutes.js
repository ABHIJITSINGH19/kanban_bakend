import express from "express";
import { getAllUsers } from "../Controllers/userController.js";
import { protect } from "../Controllers/authController.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllUsers);

export default router;
