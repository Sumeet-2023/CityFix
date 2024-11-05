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
    getUserOwnedCommunities,
    getUserCommunities,
    getCommunityMembers,
    promoteMember,
    demoteMember,
    fetchUserRole
} from "../controller/communityController";

const router = Router();

router.get("/", getCommunities);
router.get("/:id", getCommunityById);
router.get("/communityList/:creatorId", getUserOwnedCommunities);
router.get("/communityJoined/:userId", getUserCommunities);
router.get("/members/:communityId", getCommunityMembers);

router.post('/fetchUserRole/:id', fetchUserRole);
router.post("/", createCommunity);

router.put("/:id/members", joinCommunity);
router.put("/:id/ngo", joinCommunityNGO);

router.patch("/:id", patchCommunity);
router.patch("/:id/promote", promoteMember);
router.patch("/:id/demote", demoteMember);

router.delete("/:id/members", leaveCommunity);
router.delete("/:id", deleteCommunity);
router.delete("/:id/ngo", removeNGOFromCommunity);

export default router;