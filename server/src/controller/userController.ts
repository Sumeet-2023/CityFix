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
        res.status(500)
            .json({ message: `Error creating user: ${error.message}` });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    const updateData: {
        username?: string;
        location?: string;
        points?: number;
        followerCount?: number;
        followingCount?: number;
        firstname?: string;
        lastname?: string;
        email?: string;
        updatedAt?: Date;
    } = {};

    if (req.body.username !== undefined) updateData.username = req.body.username;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.points !== undefined) updateData.points = req.body.points;
    if (req.body.followerCount !== undefined) updateData.followerCount = req.body.followerCount;
    if (req.body.followingCount !== undefined) updateData.followingCount = req.body.followingCount;
    if (req.body.firstname !== undefined) updateData.firstname = req.body.firstname;
    if (req.body.lastname !== undefined) updateData.lastname = req.body.lastname;
    if (req.body.email !== undefined) updateData.email = req.body.email;

    updateData.updatedAt = new Date();

    try {
        if (Object.keys(updateData).length > 1) { // > 1 because updatedAt is always present
            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData
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
        res.status(500)
            .json({ message: `Error updating user: ${error.message}` });
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
                            radius / 6371, // Convert to radians (6371 is Earth's radius in km)
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