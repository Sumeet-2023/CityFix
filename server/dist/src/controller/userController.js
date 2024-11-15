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
exports.followUser = exports.getSuggestedUsers = exports.getNearbyUsers = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserByEmail = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({});
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500)
            .json({ message: `Error getting users: ${error.message}` });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500)
            .json({ message: `Error getting user: ${error.message}` });
    }
});
exports.getUserById = getUserById;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                username: true,
                profileUrl: true
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500)
            .json({ message: `Error getting user: ${error.message}` });
    }
});
exports.getUserByEmail = getUserByEmail;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, location, firstname, lastname, email, } = req.body;
    try {
        const user = yield prisma.user.create({
            data: {
                username,
                location: location || null,
                firstname: firstname || null,
                lastname: lastname || null,
                email,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating user: ${error.message}` });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Define updateData with a more permissive type
    const updateData = {
        updatedAt: new Date(), // Always add updatedAt
    };
    // Iterate over the keys in the request body
    Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
            updateData[key] = req.body[key];
        }
    });
    try {
        if (Object.keys(updateData).length > 1) { // > 1 because updatedAt is always present
            const updatedUser = yield prisma.user.update({
                where: { id },
                data: updateData,
            });
            res.status(200).json(updatedUser);
        }
        else {
            res.status(400).json({ message: "No update fields provided" });
        }
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.user.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(500)
            .json({ message: `Error deleting user: ${error.message}` });
    }
});
exports.deleteUser = deleteUser;
const getNearbyUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Using query parameters instead of body for GET request
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const radius = parseFloat(req.query.radius) || 10;
    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ message: "Invalid latitude or longitude" });
        return;
    }
    try {
        const users = yield prisma.user.findRaw({
            filter: {
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude],
                            radius / 6371,
                        ]
                    }
                }
            }
        });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500)
            .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
});
exports.getNearbyUsers = getNearbyUsers;
const getSuggestedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const users = yield prisma.user.findMany({
            where: {
                id: { not: userId }, // Exclude the current user
            },
            take: 10, // Limit to 10 suggestions for performance
            select: {
                id: true,
                username: true,
                profileUrl: true,
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching suggested users:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getSuggestedUsers = getSuggestedUsers;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // ID of the user who wants to follow another user
    const { targetUserId } = req.body; // ID of the user to be followed
    try {
        // Ensure both users exist
        const [user, targetUser] = yield Promise.all([
            prisma.user.findUnique({ where: { id: userId } }),
            prisma.user.findUnique({ where: { id: targetUserId } }),
        ]);
        if (!user || !targetUser) {
            res.status(404).json({ message: "User or target user not found" });
            return;
        }
        // Check if the user is already following the target user
        if (user.following && user.following.includes(targetUserId)) {
            res.status(409).json({ message: "You are already following this user" });
            return;
        }
        // Update the following and followers lists
        yield prisma.user.update({
            where: { id: userId },
            data: {
                following: {
                    push: targetUserId, // Add targetUserId to the following list
                },
                followingCount: {
                    increment: 1,
                },
            },
        });
        yield prisma.user.update({
            where: { id: targetUserId },
            data: {
                followers: {
                    push: userId, // Add userId to the followers list
                },
                followerCount: {
                    increment: 1,
                },
            },
        });
        res.status(200).json({ message: "Followed successfully" });
    }
    catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
});
exports.followUser = followUser;
