import { Router } from "express";
import { getNearbyUsers, createUser, updateUser, getUser, deleteUser } from "../controller/userController";

const router = Router();

router.get("/", getUser);

router.post("/nearby", getNearbyUsers);
router.post("/create", createUser);
router.post("/update", updateUser)
router.post("/delete", deleteUser)

export default router;