import { Router } from "express";
import { getNearbyUsers } from "../controller/userController";

const router = Router();

router.get("/", getNearbyUsers);

export default router;