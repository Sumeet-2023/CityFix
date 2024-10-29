import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNearbyUsers = async (req: Request, res: Response): Promise<void> => {
    const {
        latitude,
        longitude,
        radius = 10 // in kilometers
    } = req.body;

    try {
        const users = await prisma.user.findRaw({
            filter: {
                locationGeoJson: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude],
                            radius * 1000,
                        ]
                    },
                }
            }
        });
        res.json(users);
    } catch (error: any) {
    res
        .status(500)
        .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
}