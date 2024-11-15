"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ngoController_1 = require("../controller/ngoController");
const router = (0, express_1.Router)();
// Core NGO routes
router.post("/", ngoController_1.createNgo);
router.get("/", ngoController_1.getAllNgos);
router.get("/:id", ngoController_1.getNgoById);
router.put("/:id", ngoController_1.updateNgo);
router.delete("/:id", ngoController_1.deleteNgo);
// NGO member management routes
router.post("/members", ngoController_1.addNgoMember);
router.delete("/members/:id", ngoController_1.removeNgoMember);
router.get("/:ngoId/members", ngoController_1.getNgoMembers);
router.get("/user/:userId", ngoController_1.getUserNgos);
// Special operation routes
router.put("/:id/raised-amount", ngoController_1.updateRaisedAmount);
router.put("/:id/authorization", ngoController_1.toggleAuthorization);
exports.default = router;
