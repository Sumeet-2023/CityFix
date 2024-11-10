import { Router } from "express";
import { 
    getUsers, 
    getUserById,
    getUserByEmail,
    getNearbyUsers, 
    createUser, 
    updateUser, 
    deleteUser,
    getSuggestedUsers,
    followUser
} from "../controller/userController";

const router = Router();

router.get("/", getUsers);
router.get("/nearby", getNearbyUsers);  // Place this before the `/:id` route
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail);
router.get("/suggested/:userId", getSuggestedUsers);

router.post("/", createUser);
router.post("/:userId/follow", followUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;