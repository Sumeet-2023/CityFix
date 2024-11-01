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
router.get("/user/:userId", getIssuesByUser);
router.get("/status/:status", getIssuesByStatus);

// Issue resolution routes
router.post("/:id/proposals", addProposalToIssue);
router.post("/:id/resolve", acceptResolution);

export default router;