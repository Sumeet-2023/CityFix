import { Router } from "express";
import {
  createClan,
  getClans,
  getClanByName,
  getClanById,
  joinClan,
  leaveClan,
  updateClan,
  deleteClan,
  getClanMembers,
} from "../controller/clanController";

const router = Router();

router.get("/", getClans);
router.get("/:id", getClanById);
router.get("/name/:name", getClanByName);
router.get("/:id/members", getClanMembers);

router.post("/", createClan);
router.post("/:id/join", joinClan);
router.post("/:id/leave", leaveClan);

// Update clan details (clan creator only)
router.put("/:id", updateClan);

// Delete clan (clan creator only)
router.delete("/:id", deleteClan);

export default router;