"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controller/projectController");
const router = (0, express_1.Router)();
// Core project routes
router.get("/", projectController_1.getProjects);
router.get("/:id", projectController_1.getProjectById);
router.get("/byCommunity/:communityId", projectController_1.getProjectByCommunityId);
router.post("/", projectController_1.createProject);
router.put("/:id", projectController_1.updateProject);
router.delete("/:projectId/delete", projectController_1.deleteCommunityProject);
router.delete("/:userId/:projectId", projectController_1.deleteProject);
// Project membership routes
router.post("/join", projectController_1.joinProject);
router.post("/join/communityProject", projectController_1.joinCommunityProject);
router.post("/leave", projectController_1.leaveProject);
router.get("/:projectId/members", projectController_1.getProjectMembers);
router.get("/user/:userId", projectController_1.getUserProjects);
router.get("/:projectId/members/:userId", projectController_1.checkProjectMembership);
router.get("/byCommunityWithFilter/:communityId", projectController_1.getProjectsByCommunityWithFilter);
exports.default = router;
