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
router.post("/:id/resolve", acceptResolution);

export default router;