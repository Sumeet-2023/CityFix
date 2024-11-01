import { Router } from "express";
import { 
    getUsers, 
    getUserById,
    getNearbyUsers, 
    createUser, 
    updateUser, 
    deleteUser 
} from "../controller/userController";

const router = Router();

// Get all users
router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/nearby", getNearbyUsers);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;