"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.getUserNotifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const notifications = yield prisma.notification.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc', // Sort by the most recent notification
            },
        });
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving notifications: ${error.message}` });
    }
});
exports.getUserNotifications = getUserNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Notification ID
    try {
        const updatedNotification = yield prisma.notification.update({
            where: { id },
            data: {
                isRead: true,
            },
        });
        res.status(200).json(updatedNotification);
    }
    catch (error) {
        res.status(500).json({ message: `Error marking notification as read: ${error.message}` });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
