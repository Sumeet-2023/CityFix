"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Notification Routes
const express_1 = require("express");
const notificationController_1 = require("../controller/notificationController");
const router = (0, express_1.Router)();
router.get('/user/:userId', notificationController_1.getUserNotifications);
router.patch('/read/:id', notificationController_1.markNotificationAsRead);
exports.default = router;
