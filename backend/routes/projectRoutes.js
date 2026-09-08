import express from "express";
import {
  saveProject,
  getUserProjects,
  deleteProject,
} from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/save", authMiddleware, saveProject);
router.get("/history", authMiddleware, getUserProjects);
router.delete("/:id", authMiddleware, deleteProject);

export default router;