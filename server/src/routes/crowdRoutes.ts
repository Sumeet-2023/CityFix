import { Router } from "express";
import { createClan, getCrowds } from "../controller/crowdController";

const router = Router();

router.get("/", getCrowds);
router.post("/", createClan);

export default router;