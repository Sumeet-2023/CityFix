import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const users = await prisma.user.findMany({});
        res.json(users);
    } catch (error: any) {
        res.status(500)
        .json({message: `error getting users: ${error.message}`});
    }
}

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
                location,
                firstname,
                lastname,
                email
            }
        });
        res.json(user);
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error creating user: ${error.message}` });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params; // Assuming the user ID comes from the route parameters
    const {
      username,
      location,
      points,
      followerCount,
      followingCount,
      eventsIDs,
      ngoIDs,
    } = req.body; // Destructure other fields from request body as needed
  
    try {
      // Use Prisma's update method to update the user fields
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          username,
          location,
          points,
          followerCount,
          followingCount,
          eventsIDs,
          ngoIDs,
          updatedAt: new Date(), // Automatically update the timestamp
        },
      });
  
      res.status(200).json(updatedUser); // Return the updated user
    } catch (error: any) {
      res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
};

export const getNearbyUsers = async (req: Request, res: Response): Promise<void> => {
    const {
        latitude,
        longitude,
        radius = 10
    } = req.body;
    
    try {
        const users = await prisma.user.findRaw({
            filter: {
                location: {
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