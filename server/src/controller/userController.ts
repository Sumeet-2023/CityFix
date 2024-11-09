import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({});
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500)
            .json({ message: `Error getting users: ${error.message}` });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500)
            .json({ message: `Error getting user: ${error.message}` });
    }
};

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;
    
    try {
        const user = await prisma.user.findUnique({
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
    } catch (error: any) {
        res.status(500)
            .json({ message: `Error getting user: ${error.message}` });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const {
        username,
        location,
        firstname,
        lastname,
        email,
    } = req.body;

    try {
        const user = await prisma.user.create({
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
    } catch (error: any) {
        res.status(500).json({ message: `Error creating user: ${error.message}` });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // Define updateData with a more permissive type
    const updateData: {
        [key: string]: any;
    } = {
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
            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
            });
            res.status(200).json(updatedUser);
        } else {
            res.status(400).json({ message: "No update fields provided" });
        }
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
        await prisma.user.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(500)
            .json({ message: `Error deleting user: ${error.message}` });
    }
};

export const getNearbyUsers = async (req: Request, res: Response): Promise<void> => {
    // Using query parameters instead of body for GET request
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);
    const radius = parseFloat(req.query.radius as string) || 10;

    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ message: "Invalid latitude or longitude" });
        return;
    }
    
    try {
        const users = await prisma.user.findRaw({
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
    } catch (error: any) {
        res.status(500)
            .json({ message: `Error retrieving nearby users: ${error.message}` });
    }
};