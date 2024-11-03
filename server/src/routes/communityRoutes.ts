import { Router } from "express";
import { 
    createCommunity, 
    deleteCommunity, 
    getCommunities, 
    getCommunityById, 
    joinCommunity, 
    leaveCommunity, 
    joinCommunityNGO,
    removeNGOFromCommunity,
    patchCommunity,
    getCommunityUser
} from "../controller/communityController";

const router = Router();

// GET requests for retrieving data
router.get("/", getCommunities);
router.get("/:id", getCommunityById);
router.get("/communityList/:creatorId", getCommunityUser);

// POST for creating new resources
router.post("/", createCommunity);

// PUT for establishing relationships/updating
router.put("/:id/members", joinCommunity);       // Changed from POST to PUT
router.put("/:id/ngo", joinCommunityNGO);        // Changed from POST to PUT

router.patch("/:id", patchCommunity)

// DELETE for removing resources/relationships
router.delete("/:id/members", leaveCommunity);    // Changed from POST to DELETE
router.delete("/:id", deleteCommunity);          // Changed from POST to DELETE
router.delete("/:id/ngo", removeNGOFromCommunity);

export default router;