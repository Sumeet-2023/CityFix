"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
router.get("/", userController_1.getUsers);
router.get("/nearby", userController_1.getNearbyUsers); // Place this before the `/:id` route
router.get("/:id", userController_1.getUserById);
router.get("/email/:email", userController_1.getUserByEmail);
router.get("/suggested/:userId", userController_1.getSuggestedUsers);
router.post("/", userController_1.createUser);
router.post("/:userId/follow", userController_1.followUser);
router.patch("/:id", userController_1.updateUser);
router.delete("/:id", userController_1.deleteUser);
exports.default = router;
