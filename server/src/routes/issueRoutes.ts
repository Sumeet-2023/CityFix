import { Router } from "express";
import { createIssue, getIssues } from "../controller/issueController";

const router = Router();

router.get("/", getIssues);
router.post("/", createIssue);

export default router;