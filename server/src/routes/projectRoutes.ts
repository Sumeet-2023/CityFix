import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  joinProject,
  leaveProject,
  getProjectMembers,
  getUserProjects,
  checkProjectMembership,
} from "../controller/projectController";

const router = Router();

// Core project routes
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// Project membership routes
router.post("/join", joinProject);
router.post("/leave", leaveProject);
router.get("/:projectId/members", getProjectMembers);
router.get("/user/:userId", getUserProjects);
router.get("/:projectId/members/:userId", checkProjectMembership);

export default router;