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
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail);
router.get("/nearby", getNearbyUsers);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;