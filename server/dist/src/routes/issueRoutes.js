"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueController_1 = require("../controller/issueController");
const router = (0, express_1.Router)();
// Base routes
router.get("/", issueController_1.getIssues);
router.post("/", issueController_1.createIssue);
// Single issue routes
router.get("/:id", issueController_1.getIssueById);
router.patch("/:id", issueController_1.updateIssue);
router.delete("/:id", issueController_1.deleteIssue);
// Filter routes
router.get("/filter/condition", issueController_1.getFilteredIssues);
router.get("/user/:userId", issueController_1.getIssuesByUser);
router.get("/status/:status", issueController_1.getIssuesByStatus);
// Issue resolution routes
router.get("/proposals/:id", issueController_1.getIssueProposals);
router.get("/proposalcount/:id", issueController_1.getIssueProposalsCount);
router.post("/proposals/:id", issueController_1.addProposalToIssue);
// Update the route for accepting a proposal resolution
router.post("/proposals/accept/:proposalId", issueController_1.acceptResolution);
// Delete proposal route
router.delete("/proposals/:proposalId", issueController_1.deleteProposal);
// Issue comment route
router.get('/:issueId/comments', issueController_1.getCommentsByIssue);
router.post("/:issueId/comments", issueController_1.postComment);
exports.default = router;
