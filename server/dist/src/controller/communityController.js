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
exports.getUserRole = exports.getCommunityMembers = exports.getUserCommunities = exports.getUserOwnedCommunities = exports.deleteCommunity = exports.removeNGOFromCommunity = exports.leaveCommunity = exports.joinCommunityNGO = exports.joinCommunity = exports.getCommunityById = exports.getNearbyCommunities = exports.getCommunities = exports.fetchUserRole = exports.demoteMember = exports.promoteMember = exports.patchCommunity = exports.createCommunity = exports.communityErrorHandling = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const communityErrorHandling = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (userId = null, communityId = null, ngoId = null) {
    const queries = [
        userId ? prisma.user.findUnique({ where: { id: userId } }) : null,
        ngoId ? prisma.ngo.findUnique({ where: { id: ngoId } }) : null,
        communityId ? prisma.community.findUnique({ where: { id: communityId } }) : null,
    ];
    const [user, ngo, community] = yield Promise.all(queries);
    // Error handling for not found entities
    if (userId && !user)
        return { code: 404, message: "User not found." };
    if (ngoId && !ngo)
        return { code: 404, message: "NGO not found." };
    if (communityId && !community)
        return { code: 404, message: "Community not found." };
    // Check if user is already present in the community
    let userCommunityRecord;
    if (userId && community) {
        userCommunityRecord = yield prisma.userCommunities.findUnique({
            where: { userId_communityId: { userId, communityId: community.id } }
        });
    }
    // Check if the community belongs to the NGO
    let isCommunityBelongsToNgo, Ngopresent;
    if (communityId && ngoId) {
        isCommunityBelongsToNgo = yield prisma.community.findUnique({
            where: { id: communityId, ngoId }
        });
        Ngopresent = yield prisma.community.findUnique({
            where: { id: communityId },
            select: { ngoId: true }
        });
    }
    // Check if user already in community
    if (userCommunityRecord)
        return { code: 409, message: "User already in the community." };
    // Check if the community belongs to the NGO
    if (isCommunityBelongsToNgo)
        return { code: 403, message: "Community already belongs to the NGO." };
    if (Ngopresent && Ngopresent.ngoId !== null)
        return { code: 403, message: "This community already has another NGO." };
    return { code: 200, message: "Eligible for community actions." };
});
exports.communityErrorHandling = communityErrorHandling;
const createCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId, ngoId, communityName, description, location, creatorType } = req.body;
    try {
        const statusCheck = yield (0, exports.communityErrorHandling)(creatorType === "USER" ? creatorId : null, null, creatorType === "NGO" ? ngoId : null);
        if (statusCheck.code !== 200) {
            res.status(statusCheck.code).json(statusCheck);
            return;
        }
        const { count: communityNumber } = yield prisma.counter.update({
            where: { modelName: "Community" },
            data: { count: { increment: 1 } },
        });
        const newCommunity = yield prisma.community.create({
            data: {
                creatorId,
                ngoId,
                communityName,
                communityNumber,
                description,
                location,
                creatorType,
            },
        });
        yield prisma.userCommunities.create({
            data: { userId: creatorId, communityId: newCommunity.id, role: client_1.CommunityRoles.CREATOR },
        });
        res.status(201).json(newCommunity);
    }
    catch (error) {
        console.error("Error creating a community:", error);
        res.status(500).json({ message: `Error creating a community: ${error.message}` });
    }
});
exports.createCommunity = createCommunity;
const patchCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Community ID from route params
    const { communityName, description, location, communityPhotos } = req.body; // Fields to update
    try {
        // Check if community exists
        const community = yield prisma.community.findUnique({
            where: { id },
        });
        if (!community) {
            res.status(404).json({ message: "Community not found." });
            return;
        }
        // Perform partial update on allowed fields
        const updatedCommunity = yield prisma.community.update({
            where: { id },
            data: {
                communityName: communityName || community.communityName,
                description: description || community.description,
                location: location || community.location,
                communityPhotos: communityPhotos || community.communityPhotos,
            },
        });
        res.status(200).json({
            message: "Community updated successfully.",
            community: updatedCommunity,
        });
    }
    catch (error) {
        console.error("Error updating community:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.patchCommunity = patchCommunity;
const promoteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const currentRole = yield prisma.userCommunities.findUnique({
            where: {
                userId_communityId: {
                    userId: String(userId),
                    communityId: String(id),
                },
            },
            select: {
                role: true
            }
        });
        switch (currentRole === null || currentRole === void 0 ? void 0 : currentRole.role) {
            case client_1.CommunityRoles.CREATOR:
            case client_1.CommunityRoles.COORDINATOR:
                res.status(404).json({ message: 'You cant promote a co-ordinator or the user is creator', role: currentRole === null || currentRole === void 0 ? void 0 : currentRole.role });
                break;
            default:
                yield prisma.userCommunities.update({
                    where: {
                        userId_communityId: {
                            userId: String(userId),
                            communityId: String(id),
                        },
                    },
                    data: {
                        role: client_1.CommunityRoles.COORDINATOR
                    }
                });
        }
        if ((currentRole === null || currentRole === void 0 ? void 0 : currentRole.role) === client_1.CommunityRoles.COORDINATOR) {
        }
        else {
        }
    }
    catch (error) {
        res.status(500).json({ message: `failed to promote the user: ${error}` });
    }
});
exports.promoteMember = promoteMember;
const demoteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const currentRole = yield prisma.userCommunities.findUnique({
            where: {
                userId_communityId: {
                    userId: String(userId),
                    communityId: String(id),
                },
            },
            select: {
                role: true
            }
        });
        if ((currentRole === null || currentRole === void 0 ? void 0 : currentRole.role) === client_1.CommunityRoles.COORDINATOR) {
            yield prisma.userCommunities.update({
                where: {
                    userId_communityId: {
                        userId: String(userId),
                        communityId: String(id),
                    },
                },
                data: {
                    role: client_1.CommunityRoles.MEMBER
                }
            });
            res.json({ message: `Successfully demoted the member!` });
        }
        else if ((currentRole === null || currentRole === void 0 ? void 0 : currentRole.role) === client_1.CommunityRoles.MEMBER) {
            yield prisma.userCommunities.delete({
                where: {
                    userId_communityId: {
                        userId: String(userId),
                        communityId: String(id),
                    },
                }
            });
            res.json({ message: `Successfully removed the member!` });
        }
    }
    catch (error) {
        res.status(500).json({ message: `failed to demote the member: ${error}` });
    }
});
exports.demoteMember = demoteMember;
const fetchUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const currentRole = yield prisma.userCommunities.findUnique({
            where: {
                userId_communityId: {
                    userId: String(userId),
                    communityId: String(id),
                },
            },
            select: {
                role: true
            }
        });
        res.json({ userRole: currentRole === null || currentRole === void 0 ? void 0 : currentRole.role });
    }
    catch (error) {
        res.status(500).json({ message: `Error fetching role: ${error}` });
    }
});
exports.fetchUserRole = fetchUserRole;
const getCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const communities = yield prisma.community.findMany();
        res.json(communities);
    }
    catch (error) {
        console.error("Error retrieving communities:", error);
        res.status(500).json({ message: `Error retrieving communities: ${error.message}` });
    }
});
exports.getCommunities = getCommunities;
const getNearbyCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const radius = parseFloat(req.query.radius) || 10;
    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ message: "Invalid latitude or longitude" });
        return;
    }
    try {
        const communities = yield prisma.community.findRaw({
            filter: {
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude],
                            radius / 6371,
                        ],
                    },
                },
            },
        });
        // Transforming the response to the expected format
        // @ts-ignore
        const formattedCommunities = communities.map((community) => {
            var _a, _b, _c, _d, _e;
            return {
                id: community._id.$oid, // Converting `_id` to `id`
                communityName: community.communityName,
                communityNumber: community.communityNumber,
                creatorId: community.creatorId.$oid,
                creatorType: community.creatorType,
                description: community.description,
                location: {
                    city: (_a = community.location) === null || _a === void 0 ? void 0 : _a.city,
                    state: (_b = community.location) === null || _b === void 0 ? void 0 : _b.state,
                    country: (_c = community.location) === null || _c === void 0 ? void 0 : _c.country,
                    coordinates: (_d = community.location) === null || _d === void 0 ? void 0 : _d.coordinates,
                    type: (_e = community.location) === null || _e === void 0 ? void 0 : _e.type,
                },
                // Add any other fields if needed, and format them accordingly
            };
        });
        res.status(200).json(formattedCommunities);
    }
    catch (error) {
        res.status(500).json({ message: `Error finding nearby communities: ${error.message}` });
    }
});
exports.getNearbyCommunities = getNearbyCommunities;
const getCommunityById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const community = yield prisma.community.findUnique({
            where: { id: String(id) },
            include: {
                members: true,
            }
        });
        if (!community) {
            res.status(404).json({ message: "Community not found." });
        }
        else {
            res.json(community);
        }
    }
    catch (error) {
        console.error("Error retrieving community:", error);
        res.status(500).json({ message: `Error retrieving community: ${error.message}` });
    }
});
exports.getCommunityById = getCommunityById;
// Join community (User)
const joinCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const statusCheck = yield (0, exports.communityErrorHandling)(userId, id);
        if (statusCheck.code !== 200) {
            res.status(statusCheck.code).json(statusCheck);
            return;
        }
        yield prisma.userCommunities.create({
            data: { userId, communityId: id },
        });
        res.status(201).json({ message: "User successfully joined the community." });
    }
    catch (error) {
        console.error("Error joining community:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.joinCommunity = joinCommunity;
// Join community (NGO)
const joinCommunityNGO = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { ngoId } = req.body;
    try {
        const statusCheck = yield (0, exports.communityErrorHandling)(null, id, ngoId);
        if (statusCheck.code !== 200) {
            res.status(statusCheck.code).json(statusCheck);
            return;
        }
        yield prisma.community.update({
            where: {
                id: id
            },
            data: { ngoId: ngoId },
        });
        res.status(200).json({ message: "NGO successfully joined the community." });
    }
    catch (error) {
        console.error("Error joining community:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.joinCommunityNGO = joinCommunityNGO;
// Leave community (User)
const leaveCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const community = yield prisma.community.findUnique({
            where: { id }
        });
        if (!community) {
            res.status(404).json({ message: "Community not found." });
            return;
        }
        const userCommunityRecord = yield prisma.userCommunities.findUnique({
            where: {
                userId_communityId: {
                    userId: userId,
                    communityId: id
                }
            }
        });
        if (!userCommunityRecord) {
            res.status(404).json({ message: "User is not a member of this community." });
            return;
        }
        yield prisma.userCommunities.delete({
            where: {
                userId_communityId: {
                    userId: userId,
                    communityId: id
                }
            }
        });
        res.status(200).json({ message: "User successfully left the community." });
    }
    catch (error) {
        console.error("Error leaving community:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.leaveCommunity = leaveCommunity;
const removeNGOFromCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const community = yield prisma.community.findUnique({
            where: { id },
            select: { ngoId: true }
        });
        if (!community) {
            res.status(404).json({ message: "Community not found." });
            return;
        }
        if (!community.ngoId) {
            res.status(400).json({ message: "This community doesn't have an NGO to remove." });
            return;
        }
        yield prisma.community.update({
            where: { id },
            data: { ngoId: null }
        });
        res.status(200).json({ message: "NGO successfully removed from the community." });
    }
    catch (error) {
        console.error("Error removing NGO from community:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.removeNGOFromCommunity = removeNGOFromCommunity;
// Delete community
const deleteCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get communityId from route params
    try {
        const community = yield prisma.community.findUnique({
            where: { id }
        });
        if (!community) {
            res.status(404).json({ message: "Community not found." });
            return;
        }
        yield prisma.community.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({ message: "Successfully deleted the community and related memberships." });
    }
    catch (error) {
        console.error("Error deleting community:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.deleteCommunity = deleteCommunity;
const getUserOwnedCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    try {
        // Validate creatorId
        if (!creatorId) {
            res.status(400).json({ message: "Creator ID is required" });
            return;
        }
        const community = yield prisma.community.findMany({
            where: {
                creatorId: {
                    equals: creatorId,
                    not: null // Explicitly exclude null values
                }
            },
            include: {
                creator: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });
        if (community.length === 0) {
            res.status(200).json({ message: "No communities found for this creator", communities: [] });
            return;
        }
        res.status(200).json(community);
    }
    catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({
            message: "Could not get community list for the specified user",
            error: error.message
        });
    }
});
exports.getUserOwnedCommunities = getUserOwnedCommunities;
const getUserCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const communities = yield prisma.community.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    {
                        members: {
                            some: {
                                userId: userId
                            }
                        }
                    }
                ]
            },
            include: {
                creator: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        if (communities.length === 0) {
            res.status(200).json({ message: "No communities found for this user", communities: [] });
            return;
        }
        res.status(200).json(communities);
    }
    catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({
            message: "Could not get community list for the specified user",
            error: error.message
        });
    }
});
exports.getUserCommunities = getUserCommunities;
const getCommunityMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { communityId } = req.params;
    try {
        const community = yield prisma.userCommunities.findMany({
            where: {
                communityId: communityId
            },
            select: {
                user: true,
                community: true,
                role: true
            }
        });
        res.json(community);
    }
    catch (error) {
        res.status(500).json({ message: `Error finding members: ${error}` });
    }
});
exports.getCommunityMembers = getCommunityMembers;
const getUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { communityId, userId } = req.params;
    try {
        const rel = yield prisma.userCommunities.findUnique({
            where: {
                userId_communityId: {
                    userId: userId,
                    communityId: communityId
                }
            }
        });
        res.json({ role: rel === null || rel === void 0 ? void 0 : rel.role });
    }
    catch (error) {
        res.status(500).json({ message: `Error getting user role: ${error}` });
    }
});
exports.getUserRole = getUserRole;
