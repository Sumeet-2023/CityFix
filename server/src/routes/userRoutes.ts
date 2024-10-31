import { Router } from "express";
import { getNearbyUsers, createUser, updateUser, getUser } from "../controller/userController";

const router = Router();

router.get("/", getUser);

router.post("/nearby", getNearbyUsers);
router.post("/create", createUser);
router.post("/update", updateUser)

export default router;