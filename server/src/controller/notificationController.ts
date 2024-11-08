import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
  
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc', // Sort by the most recent notification
        },
      });
  
      res.status(200).json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: `Error retrieving notifications: ${error.message}` });
    }
  };

  export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Notification ID
  
    try {
      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
        },
      });
  
      res.status(200).json(updatedNotification);
    } catch (error: any) {
      res.status(500).json({ message: `Error marking notification as read: ${error.message}` });
    }
  };  