import { Router } from "express";
import { createClan, getClans, joinClan } from "../controller/clanController";

const router = Router();

router.get("/", getClans);

router.post("/", createClan);
router.post("/joinClan", joinClan);

export default router;