import { Router } from "express";
import { 
    getUsers, 
    getUserById,
    getUserByEmail,
    getNearbyUsers, 
    createUser, 
    updateUser, 
    deleteUser 
} from "../controller/userController";

const router = Router();

router.get("/", getUsers);
router.get("/nearby", getNearbyUsers);  // Place this before the `/:id` route
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail);

router.post("/", createUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;