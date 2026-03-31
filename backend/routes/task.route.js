import express from "express";
import { createTask, getTasks, toggleTask, deleteTask } from "../controllers/task.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, createTask);

router.get("/", protectedRoute, getTasks);

router.put("/:id", protectedRoute, toggleTask);

router.delete("/:id", protectedRoute, deleteTask);



export default router
