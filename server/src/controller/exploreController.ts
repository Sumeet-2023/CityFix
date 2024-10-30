import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNearbyCommunities = async (req: Request, res: Response): Promise<void> => {
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
        const communities = await prisma.community.findRaw({
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
    } catch (error: any) {
    res
        .status(500)
        .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
}

export const getNearbyCrowdFundings = async (req: Request, res: Response): Promise<void> => {
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
        const crowd = await prisma.crowd.findRaw({
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
        res.json(crowd);
    } catch (error: any) {
    res
        .status(500)
        .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
}

export const getNearbyIssues = async (req: Request, res: Response): Promise<void> => {
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
        const issues = await prisma.issue.findRaw({
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
    } catch (error: any) {
    res
        .status(500)
        .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
}

export const getNearbyAll = async (req: Request, res: Response): Promise<void> => {
    // Get parameters from query string instead of request body
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
        const radiusInRadians = radius / 6371000;

        const [issues, crowd, communities] = await Promise.all([
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
            prisma.crowd.findRaw({
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
            crowd,
            communities,
        });
    } catch (error: any) {
        console.error('Error in getNearbyAll:', error);
        res.status(500).json({ 
            message: `Error retrieving nearby locations: ${error.message}`,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};