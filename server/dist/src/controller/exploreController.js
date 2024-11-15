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
exports.searchAll = exports.getClanAutocomplete = exports.searchClan = exports.getNearbyAll = exports.getNearbyIssues = exports.getNearbyCrowdFundings = exports.getNearbyCommunities = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getNearbyCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const radius = Number(req.query.radius) || 1000;
    // Validate parameters
    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
            message: 'Invalid latitude or longitude. Please provide valid numbers.'
        });
        return;
    }
    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        res.status(400).json({
            message: 'Coordinates out of range. Latitude must be between -90 and 90, longitude between -180 and 180.'
        });
        return;
    }
    const radiusInRadians = radius / 6371;
    try {
        const communities = yield prisma.community.findRaw({
            filter: {
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude],
                            radiusInRadians
                        ]
                    },
                }
            }
        });
        res.json(communities);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
});
exports.getNearbyCommunities = getNearbyCommunities;
const getNearbyCrowdFundings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const radius = Number(req.query.radius) || 1000;
    // Validate parameters
    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
            message: 'Invalid latitude or longitude. Please provide valid numbers.'
        });
        return;
    }
    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        res.status(400).json({
            message: 'Coordinates out of range. Latitude must be between -90 and 90, longitude between -180 and 180.'
        });
        return;
    }
    const radiusInRadians = radius / 6371;
    try {
        const clan = yield prisma.clan.findRaw({
            filter: {
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude],
                            radiusInRadians
                        ]
                    },
                }
            }
        });
        res.json(clan);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
});
exports.getNearbyCrowdFundings = getNearbyCrowdFundings;
const getNearbyIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const radius = Number(req.query.radius) || 1000;
    // Validate parameters
    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
            message: 'Invalid latitude or longitude. Please provide valid numbers.'
        });
        return;
    }
    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        res.status(400).json({
            message: 'Coordinates out of range. Latitude must be between -90 and 90, longitude between -180 and 180.'
        });
        return;
    }
    const radiusInRadians = radius / 6371;
    try {
        const issues = yield prisma.issue.findRaw({
            filter: {
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude],
                            radiusInRadians
                        ]
                    },
                }
            }
        });
        res.json(issues);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
});
exports.getNearbyIssues = getNearbyIssues;
const getNearbyAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const radius = Number(req.query.radius) || 1000;
    // Validate parameters
    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
            message: 'Invalid latitude or longitude. Please provide valid numbers.'
        });
        return;
    }
    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        res.status(400).json({
            message: 'Coordinates out of range. Latitude must be between -90 and 90, longitude between -180 and 180.'
        });
        return;
    }
    try {
        // Convert radius from kilometers to radians (required by MongoDB)
        // MongoDB's $centerSphere expects radius in radians
        // To convert km to radians, divide by Earth's radius (6371 km)
        const radiusInRadians = radius / 6371;
        const [issues, clan, communities] = yield Promise.all([
            prisma.issue.findRaw({
                filter: {
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [longitude, latitude],
                                radiusInRadians
                            ]
                        },
                    }
                }
            }),
            prisma.clan.findRaw({
                filter: {
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [longitude, latitude],
                                radiusInRadians
                            ]
                        },
                    }
                }
            }),
            prisma.community.findRaw({
                filter: {
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [longitude, latitude],
                                radiusInRadians
                            ]
                        },
                    }
                }
            })
        ]);
        res.json({
            issues,
            clan,
            communities,
        });
    }
    catch (error) {
        console.error('Error in getNearbyAll:', error);
        res.status(500).json({
            message: `Error retrieving nearby locations: ${error.message}`,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});
exports.getNearbyAll = getNearbyAll;
const searchClan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = String(req.query.id);
    try {
        const clan = yield prisma.clan.findUnique({
            where: {
                id: id,
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
exports.searchClan = searchClan;
// Autocomplete endpoint for clanName
const getClanAutocomplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = String(req.query.q || ""); // `q` is the query parameter
    try {
        const clans = yield prisma.clan.findMany({
            where: {
                clanName: {
                    contains: query, // Search for partial matches
                    mode: 'insensitive', // Makes the search case-insensitive
                },
            },
            select: {
                clanName: true,
                location: true,
                description: true
            },
            take: 10, // Limit results to avoid sending too much data
        });
        res.json(clans.map(clan => ({ name: clan.clanName, location: clan.location, description: clan.description })));
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving clan names: ${error.message}` });
    }
});
exports.getClanAutocomplete = getClanAutocomplete;
// Autocomplete endpoint for community
// export const getCommunityAutocomplete = async (req: Request, res: Response): Promise<void> => {
//     const query = String(req.query.q || ""); // `q` is the query parameter
//     try {
//       const clans = await prisma.community.findMany({
//         where: {
//           projectName: {
//             contains: query, // Search for partial matches
//             mode: 'insensitive', // Makes the search case-insensitive
//           },
//         },
//         select: {
//           clanName: true,
//           location: true,
//           description: true
//         },
//         take: 10, // Limit results to avoid sending too much data
//       });
//       res.json(clans.map(clan => ({ name: clan.clanName, location: clan.location, description: clan.description })));
//     } catch (error: any) {
//       res.status(500).json({ message: `Error retrieving clan names: ${error.message}` });
//     }
// };
const searchAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.searchAll = searchAll;
