import { Router } from "express";
import {
  createNgo,
  getAllNgos,
  getNgoById,
  updateNgo,
  deleteNgo,
  addNgoMember,
  removeNgoMember,
  getNgoMembers,
  getUserNgos,
  updateRaisedAmount,
  toggleAuthorization
} from "../controller/ngoController";

const router = Router();

// Core NGO routes
router.post("/", createNgo);
router.get("/", getAllNgos);
router.get("/:id", getNgoById);
router.put("/:id", updateNgo);
router.delete("/:id", deleteNgo);

// NGO member management routes
router.post("/members", addNgoMember);
router.delete("/members/:id", removeNgoMember);
router.get("/:ngoId/members", getNgoMembers);
router.get("/user/:userId", getUserNgos);

// Special operation routes
router.put("/:id/raised-amount", updateRaisedAmount);
router.put("/:id/authorization", toggleAuthorization);

export default router;