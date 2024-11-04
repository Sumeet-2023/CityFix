import { Router } from "express";
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssuesByUser,
  getIssuesByStatus,
  addProposalToIssue,
  acceptResolution,
  getFilteredIssues,
  getIssueProposals,
  getIssueProposalsCount,
  postComment,
  getCommentsByIssue,
} from "../controller/issueController";

const router = Router();

// Base routes
router.get("/", getIssues);
router.post("/", createIssue);

// Single issue routes
router.get("/:id", getIssueById);
router.patch("/:id", updateIssue);
router.delete("/:id", deleteIssue);

// Filter routes
router.get("/filter/condition", getFilteredIssues);
router.get("/user/:userId", getIssuesByUser);
router.get("/status/:status", getIssuesByStatus);

// Issue resolution routes
router.get("/:id/proposals", getIssueProposals);
router.get("/:id/proposalcount", getIssueProposalsCount);
router.post("/:id/proposals", addProposalToIssue);
// Update the route for accepting a proposal resolution
router.post("/proposals/:proposalId/accept", acceptResolution);


// Issue comment route
router.get('/:issueId/comments', getCommentsByIssue);
router.post("/:issueId/comments", postComment);

export default router;