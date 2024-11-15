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
exports.getClanMembers = exports.deleteClan = exports.updateClan = exports.leaveClan = exports.joinClan = exports.getClanById = exports.getClanByName = exports.getUserClan = exports.getClans = exports.createClan = exports.checkUserClanStatus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkUserClanStatus = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, clanId = null) {
    const user = yield prisma.user.findUnique({
        where: { id: userId },
        include: {
            clanCreated: true,
            userClan: true,
        },
    });
    if (!user) {
        return { code: 404, message: 'User not found.' };
    }
    if (user.userClan || user.clanCreated) {
        return { code: 400, message: 'User is already a member of a clan or created a clan' };
    }
    if (!clanId) {
        return { code: 200, message: 'User is eligible to create a clan' };
    }
    const clan = yield prisma.clan.findUnique({
        where: { id: clanId },
    });
    if (!clan) {
        return { code: 400, message: 'Clan does not exist or has not been created yet.' };
    }
    const userClan = yield prisma.userClan.findUnique({
        where: {
            userId: userId,
            clanId: clanId,
        },
    });
    if (userClan) {
        return { code: 400, message: 'User is already a member of this clan.' };
    }
    if (user.clanCreated || user.userClan) {
        return { code: 400, message: 'User has either created a clan or is part of another clan.' };
    }
    return { code: 200, message: 'User is eligible to join or create a clan.' };
});
exports.checkUserClanStatus = checkUserClanStatus;
const createClan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId, clanName, description, location, clanTag, members, type, badge } = req.body;
    try {
        const statusCheck = yield (0, exports.checkUserClanStatus)(creatorId);
        console.log(req.body);
        if (statusCheck.code !== 200) {
            res.status(statusCheck.code).json(statusCheck);
            return;
        }
        // Check if clan tag is unique
        const existingClanTag = yield prisma.clan.findFirst({
            where: { clanTag }
        });
        if (existingClanTag) {
            res.status(400).json({ message: 'Clan tag already exists' });
            return;
        }
        const newClan = yield prisma.clan.create({
            data: {
                creatorId,
                clanName,
                description,
                location,
                clanTag,
                members,
                type,
                badge
            },
        });
        yield prisma.userClan.create({
            data: {
                userId: creatorId,
                clanId: newClan.id
            }
        });
        res.status(201).json(newClan);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating a clan: ${error.message}` });
    }
});
exports.createClan = createClan;
const getClans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = '1', limit = '10', location, search } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const whereConditions = {};
        if (location) {
            whereConditions.location = {
                equals: location
            };
        }
        if (search) {
            whereConditions.OR = [
                { clanName: { contains: search } },
                { clanTag: { contains: search } },
                { description: { contains: search } }
            ];
        }
        const [clans, totalCount] = yield Promise.all([
            prisma.clan.findMany({
                where: whereConditions,
                skip,
                take: limitNumber,
                include: {
                    creator: {
                        select: {
                            username: true,
                        }
                    },
                    _count: {
                        select: { members: true }
                    }
                }
            }),
            prisma.clan.count({ where: whereConditions })
        ]);
        res.json({
            clans,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
            totalCount
        });
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving clans: ${error.message}` });
    }
});
exports.getClans = getClans;
const getUserClan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const clanRel = yield prisma.userClan.findUnique({
            where: {
                userId: userId
            },
            select: {
                clan: true
            }
        });
        const members = yield prisma.userClan.findMany({
            where: {
                clanId: clanRel === null || clanRel === void 0 ? void 0 : clanRel.clan.id
            },
            select: {
                user: true
            }
        });
        res.status(200).json(Object.assign(Object.assign({}, clanRel === null || clanRel === void 0 ? void 0 : clanRel.clan), { members: members }));
    }
    catch (error) {
        res.status(404).json({ message: `Error fetching user clan: ${error}` });
    }
});
exports.getUserClan = getUserClan;
const getClanByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clanName = req.params.clanName ? String(req.params.clanName) : "";
    if (!clanName) {
        res.status(400).json({ message: "Missing clan name in query" });
        return;
    }
    try {
        const clan = yield prisma.clan.findMany({
            where: {
                clanName: clanName,
            }
        });
        res.json(clan);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving clans: ${error.message}` });
    }
});
exports.getClanByName = getClanByName;
const getClanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const clan = yield prisma.clan.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            }
                        }
                    }
                },
                _count: {
                    select: { members: true }
                }
            }
        });
        if (!clan) {
            res.status(404).json({ message: 'Clan not found' });
            return;
        }
        res.json(clan);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving clan: ${error.message}` });
    }
});
exports.getClanById = getClanById;
const joinClan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: clanId } = req.params;
    const { userId } = req.body;
    try {
        const statusCheck = yield (0, exports.checkUserClanStatus)(userId, clanId);
        if (statusCheck.code !== 200) {
            res.status(statusCheck.code).json(statusCheck);
            return;
        }
        yield prisma.userClan.create({
            data: {
                userId,
                clanId
            }
        });
        res.status(201).json({ message: 'User successfully joined the clan.' });
    }
    catch (error) {
        console.error('Error joining clan:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.joinClan = joinClan;
const leaveClan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: clanId } = req.params;
    const { userId } = req.body;
    try {
        const userClan = yield prisma.userClan.findUnique({
            where: {
                userId_clanId: {
                    userId,
                    clanId
                }
            },
            include: {
                clan: true
            }
        });
        if (!userClan) {
            res.status(404).json({ message: 'User is not a member of this clan' });
            return;
        }
        if (userClan.clan.creatorId === userId) {
            res.status(400).json({ message: 'Clan creator cannot leave the clan. Transfer ownership or delete the clan instead.' });
            return;
        }
        yield prisma.userClan.delete({
            where: {
                userId_clanId: {
                    userId,
                    clanId
                }
            }
        });
        res.status(200).json({ message: 'Successfully left the clan' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.leaveClan = leaveClan;
const updateClan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { clanName, description, location } = req.body;
    const userId = req.body.userId;
    try {
        const clan = yield prisma.clan.findUnique({
            where: { id }
        });
        if (!clan) {
            res.status(404).json({ message: 'Clan not found' });
            return;
        }
        if (clan.creatorId !== userId) {
            res.status(403).json({ message: 'Only clan creator can update clan details' });
            return;
        }
        const updatedClan = yield prisma.clan.update({
            where: { id },
            data: {
                clanName,
                description,
                location
            }
        });
        res.json(updatedClan);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.updateClan = updateClan;
const deleteClan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.body.userId;
    try {
        const clan = yield prisma.clan.findUnique({
            where: { id }
        });
        if (!clan) {
            res.status(404).json({ message: 'Clan not found' });
            return;
        }
        if (clan.creatorId !== userId) {
            res.status(403).json({ message: 'Only clan creator can delete the clan' });
            return;
        }
        yield prisma.$transaction([
            prisma.userClan.deleteMany({
                where: { clanId: id }
            }),
            prisma.clan.delete({
                where: { id }
            })
        ]);
        res.status(200).json({ message: 'Clan successfully deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.deleteClan = deleteClan;
const getClanMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    try {
        const [members, totalCount] = yield Promise.all([
            prisma.userClan.findMany({
                where: { clanId: id },
                skip,
                take: limitNumber,
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                        }
                    }
                },
                orderBy: {
                    joinedAt: 'desc'
                }
            }),
            prisma.userClan.count({
                where: { clanId: id }
            })
        ]);
        res.json({
            members,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
            totalCount
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getClanMembers = getClanMembers;
