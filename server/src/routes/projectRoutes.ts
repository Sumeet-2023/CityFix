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
  getProjectByCommunityId,
  joinCommunityProject,
  getProjectsByCommunityWithFilter,
} from "../controller/projectController";

const router = Router();

// Core project routes
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.get("/byCommunity/:communityId", getProjectByCommunityId);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:userId/:projectId", deleteProject);

// Project membership routes
router.post("/join", joinProject);
router.post("/join/communityProject", joinCommunityProject);
router.post("/leave", leaveProject);
router.get("/:projectId/members", getProjectMembers);
router.get("/user/:userId", getUserProjects);
router.get("/:projectId/members/:userId", checkProjectMembership);

router.get("/byCommunityWithFilter/:communityId", getProjectsByCommunityWithFilter);

export default router;