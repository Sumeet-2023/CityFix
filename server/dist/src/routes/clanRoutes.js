"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clanController_1 = require("../controller/clanController");
const router = (0, express_1.Router)();
router.get("/", clanController_1.getClans);
router.get("/joinedClan/:userId", clanController_1.getUserClan);
router.get("/:id", clanController_1.getClanById);
router.get("/name/:name", clanController_1.getClanByName);
router.get("/:id/members", clanController_1.getClanMembers);
router.post("/", clanController_1.createClan);
router.post("/:id/join", clanController_1.joinClan);
router.post("/:id/leave", clanController_1.leaveClan);
// Update clan details (clan creator only)
router.put("/:id", clanController_1.updateClan);
// Delete clan (clan creator only)
router.delete("/:id", clanController_1.deleteClan);
exports.default = router;
