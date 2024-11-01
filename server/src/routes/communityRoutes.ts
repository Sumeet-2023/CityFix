import { Router } from "express";
import { createCommunity, deleteCommunity, getCommunities, getCommunityById, joinCommunity, leaveCommunity, joinCommunityNGO } from "../controller/communityController";

const router = Router();

router.get("/", getCommunities);

router.post("/", createCommunity);
router.post("/join", joinCommunity);
router.post("/joinNGO", joinCommunityNGO);
router.post("/leave", leaveCommunity);
router.post("/delete", deleteCommunity);

export default router;