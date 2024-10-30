import { Router } from "express";
import { getNearbyAll } from "../controller/exploreController";

const router = Router();

router.get("/", getNearbyAll);

export default router;