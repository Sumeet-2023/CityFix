import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface StatusMessage {
  code: number;
  message: string;
}

export const checkUserClanStatus = async (userId: string, clanId: string | null = null): Promise<StatusMessage> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clanCreated: true,
      userClan: true,
    },
  });

  if (!user) {
    return { code: 404, message: 'User not found.' };
  }

  if(user.userClan || user.clanCreated){
    return {code: 400, message: 'User is already a member of a clan or created a clan'};
  }

  if (!clanId){
    return {code: 200, message: 'User is eligible to create a clan'};
  }

  const clan = await prisma.clan.findUnique({
    where: { id: clanId },
  });

  if (!clan) {
    return { code: 400, message: 'Clan does not exist or has not been created yet.' };
  }

  const userClan = await prisma.userClan.findUnique({
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
}

export const createClan = async (req: Request, res: Response): Promise<void> => {
  const {
      creatorId,               
      clanName,         
      description,      
      location,         
      clanTag,          
  } = req.body;

  try {
    const statusCheck =  await checkUserClanStatus(creatorId);

    if (statusCheck.code !== 200){
      res.status(statusCheck.code).json(statusCheck);
      return;
    }

    const newClan = await prisma.clan.create({
      data: {
          creatorId,
          clanName,         
          description,      
          location,         
          clanTag,
      },
    });
    res.status(201).json(newClan);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a clan: ${error.message}` });
  }
};

export const getClans = async (req: Request, res: Response): Promise<void> => {
  try {
    const clans = await prisma.clan.findMany();
    res.json(clans);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving clans: ${error.message}` });
  }
};

export const getClanById = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.query.id);
  try {
    const clan = await prisma.clan.findUnique({
      where: {
        id: id,
      }
    });
    res.json(clan);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving clan: ${error.message}` });
  }
}
 
export const joinClan = async (req: Request, res: Response): Promise<void> => {
  const {
    clanId,
    userId,
  } = req.body;

  try {
    const statusCheck =  await checkUserClanStatus(userId, clanId);

    if (statusCheck.code !== 200){
      res.status(statusCheck.code).json(statusCheck);
      return;
    }

    await prisma.userClan.create({
      data: {
        userId: userId,
        clanId: clanId
      }
    })

    res.status(201).json({ message: 'User successfully joined the clan.' });
  } catch (error: any) {
    console.error('Error joining clan:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}