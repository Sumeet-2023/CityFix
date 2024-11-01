import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

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

  if (user.userClan || user.clanCreated) {
    return { code: 400, message: 'User is already a member of a clan or created a clan' };
  }

  if (!clanId) {
    return { code: 200, message: 'User is eligible to create a clan' };
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
    const statusCheck = await checkUserClanStatus(creatorId);

    if (statusCheck.code !== 200) {
      res.status(statusCheck.code).json(statusCheck);
      return;
    }

    // Check if clan tag is unique
    const existingClanTag = await prisma.clan.findFirst({
      where: { clanTag }
    });

    if (existingClanTag) {
      res.status(400).json({ message: 'Clan tag already exists' });
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
    res.status(500).json({ message: `Error creating a clan: ${error.message}` });
  }
};

export const getClans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', location, search } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const whereConditions: Prisma.ClanWhereInput = {};
    
    if (location) {
      whereConditions.location = {
        equals: location as string
      };
    }

    if (search) {
      whereConditions.OR = [
        { clanName: { contains: search as string } },
        { clanTag: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }

    const [clans, totalCount] = await Promise.all([
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
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving clans: ${error.message}` });
  }
};

export const getClanByName = async (req: Request, res: Response): Promise<void> => {
  const clanName = req.params.clanName ? String(req.params.clanName) : "";
  if (!clanName) {
    res.status(400).json({ message: "Missing clan name in query" });
    return;
  }
  try {
    const clan = await prisma.clan.findMany({
      where: {
        clanName: clanName,
      }
    });
    res.json(clan);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving clans: ${error.message}` });
  }
}

export const getClanById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const clan = await prisma.clan.findUnique({
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
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving clan: ${error.message}` });
  }
};

export const joinClan = async (req: Request, res: Response): Promise<void> => {
  const { id: clanId } = req.params;
  const { userId } = req.body;

  try {
    const statusCheck = await checkUserClanStatus(userId, clanId);

    if (statusCheck.code !== 200) {
      res.status(statusCheck.code).json(statusCheck);
      return;
    }

    await prisma.userClan.create({
      data: {
        userId,
        clanId
      }
    });

    res.status(201).json({ message: 'User successfully joined the clan.' });
  } catch (error: any) {
    console.error('Error joining clan:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const leaveClan = async (req: Request, res: Response): Promise<void> => {
  const { id: clanId } = req.params;
  const { userId } = req.body;

  try {
    const userClan = await prisma.userClan.findUnique({
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

    await prisma.userClan.delete({
      where: {
        userId_clanId: {
          userId,
          clanId
        }
      }
    });

    res.status(200).json({ message: 'Successfully left the clan' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateClan = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { clanName, description, location } = req.body;
  const userId = req.body.userId;

  try {
    const clan = await prisma.clan.findUnique({
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

    const updatedClan = await prisma.clan.update({
      where: { id },
      data: {
        clanName,
        description,
        location
      }
    });

    res.json(updatedClan);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteClan = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    const clan = await prisma.clan.findUnique({
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

    await prisma.$transaction([
      prisma.userClan.deleteMany({
        where: { clanId: id }
      }),
      prisma.clan.delete({
        where: { id }
      })
    ]);

    res.status(200).json({ message: 'Clan successfully deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getClanMembers = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { page = '1', limit = '10' } = req.query;
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const [members, totalCount] = await Promise.all([
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
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};