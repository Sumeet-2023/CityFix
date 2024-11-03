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
  deleteProposal
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
router.get("/proposals/:id", getIssueProposals);
router.get("/proposalcount/:id", getIssueProposalsCount);
router.post("/proposals/:id", addProposalToIssue);
// Update the route for accepting a proposal resolution
router.post("/proposals/accept/:proposalId", acceptResolution);
// Delete proposal route
router.delete("/proposals/:proposalId", deleteProposal);

export default router;