import { Router } from "express";
import { getClanAutocomplete, getNearbyAll } from "../controller/exploreController";

const router = Router();

router.get("/", getNearbyAll);
router.get("/clan", getClanAutocomplete);

export default router;