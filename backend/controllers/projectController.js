import mongoose from "mongoose";
import Project from "../models/Project.js";

// Save or Update a Project
export const saveProject = async (req, res) => {
  try {
    // Extract ID regardless of whether the token decoded as id, _id, or userId
    const rawUserId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId ||
      req.userId;

    if (!rawUserId) {
      return res.status(401).json({ message: "Unauthorized: Missing user authentication" });
    }

    const userId = new mongoose.Types.ObjectId(rawUserId);
    const { id, title, canvasData } = req.body;

    let project;

    if (id) {
      project = await Project.findOneAndUpdate(
        { _id: id, user: userId },
        { title, ...(canvasData && { canvasData }) },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
    } else {
      project = await Project.create({
        user: userId,
        title: title || "Untitled Project",
        canvasData: canvasData || [],
      });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error("Save Project Error:", error);
    return res.status(500).json({ message: "Error saving project", error: error.message });
  }
};

// Get all projects for logged-in user
export const getUserProjects = async (req, res) => {
  try {
    const rawUserId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId ||
      req.userId;

    if (!rawUserId) {
      return res.status(401).json({ message: "Unauthorized: Missing user authentication" });
    }

    const userId = new mongoose.Types.ObjectId(rawUserId);
    const projects = await Project.find({ user: userId }).sort({ updatedAt: -1 });

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Get History Error:", error);
    return res.status(500).json({ message: "Error fetching history", error: error.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const rawUserId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId ||
      req.userId;

    if (!rawUserId) {
      return res.status(401).json({ message: "Unauthorized: Missing user authentication" });
    }

    const userId = new mongoose.Types.ObjectId(rawUserId);
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: userId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};