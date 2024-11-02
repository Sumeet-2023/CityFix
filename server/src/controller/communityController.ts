import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface StatusMessage {
  code: number;
  message: string;
}

export const communityErrorHandling = async (
  userId: string | null = null,
  communityId: string | null = null,
  ngoId: string | null = null
): Promise<StatusMessage> => {
  const queries = [
    userId ? prisma.user.findUnique({ where: { id: userId } }) : null,
    ngoId ? prisma.ngo.findUnique({ where: { id: ngoId } }) : null,
    communityId ? prisma.community.findUnique({ where: { id: communityId } }) : null,
  ];

  const [user, ngo, community] = await Promise.all(queries);

  // Error handling for not found entities
  if (userId && !user) return { code: 404, message: "User not found." };
  if (ngoId && !ngo) return { code: 404, message: "NGO not found." };
  if (communityId && !community) return { code: 404, message: "Community not found." };

  // Check if user is already present in the community
  let userCommunityRecord;
  if (userId && community) {
    userCommunityRecord = await prisma.userCommunities.findUnique({
      where: { userId_communityId: { userId, communityId: community.id } }
    });
  }

  // Check if the community belongs to the NGO
  let isCommunityBelongsToNgo, Ngopresent;
  if (communityId && ngoId) {
    isCommunityBelongsToNgo = await prisma.community.findUnique({
      where: { id: communityId, ngoId }
    });
    Ngopresent = await prisma.community.findUnique({
      where: { id: communityId },
      select: { ngoId: true }
    });
  }

  // Check if user already in community
  if (userCommunityRecord) return { code: 409, message: "User already in the community." };

  // Check if the community belongs to the NGO
  if (isCommunityBelongsToNgo) return { code: 403, message: "Community already belongs to the NGO." };

  if (Ngopresent && Ngopresent.ngoId !== null) return { code: 403, message: "This community already has another NGO." }

  return { code: 200, message: "Eligible for community actions." };
};

export const createCommunity = async (req: Request, res: Response): Promise<void> => {
  const { creatorId, ngoId, communityName, description, location, creatorType } = req.body;

  try {
    const statusCheck = await communityErrorHandling(
      creatorType === "USER" ? creatorId : null,
      null,
      creatorType === "NGO" ? ngoId : null
    );

    if (statusCheck.code !== 200) {
      res.status(statusCheck.code).json(statusCheck);
      return;
    }

    const { count: communityNumber } = await prisma.counter.update({
      where: { modelName: "Community" },
      data: { count: { increment: 1 } },
    });

    const newCommunity = await prisma.community.create({
      data: {
        creatorId,
        ngoId,
        communityName,
        communityNumber,
        description,
        location,
        creatorType,
      },
    });
    res.status(201).json(newCommunity);
  } catch (error: any) {
    console.error("Error creating a community:", error);
    res.status(500).json({ message: `Error creating a community: ${error.message}` });
  }
};

export const getCommunities = async (req: Request, res: Response): Promise<void> => {
  try {
    const communities = await prisma.community.findMany();
    res.json(communities);
  } catch (error: any) {
    console.error("Error retrieving communities:", error);
    res.status(500).json({ message: `Error retrieving communities: ${error.message}` });
  }
};

export const getCommunityById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const community = await prisma.community.findUnique({
      where: { id: String(id) },
    });

    if (!community) {
      res.status(404).json({ message: "Community not found." });
    } else {
      res.json(community);
    }
  } catch (error: any) {
    console.error("Error retrieving community:", error);
    res.status(500).json({ message: `Error retrieving community: ${error.message}` });
  }
};

// Join community (User)
export const joinCommunity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const statusCheck = await communityErrorHandling(userId, id);
    if (statusCheck.code !== 200) {
      res.status(statusCheck.code).json(statusCheck);
      return;
    }

    await prisma.userCommunities.create({
      data: { userId, communityId: id },
    });

    res.status(201).json({ message: "User successfully joined the community." });
  } catch (error: any) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Join community (NGO)
export const joinCommunityNGO = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { ngoId } = req.body;

  try {
    const statusCheck = await communityErrorHandling(null, id, ngoId);
    if (statusCheck.code !== 200) {
      res.status(statusCheck.code).json(statusCheck);
      return;
    }

    await prisma.community.update({
      where: {
        id: id
      },
      data: { ngoId: ngoId },
    });

    res.status(200).json({ message: "NGO successfully joined the community." });
  } catch (error: any) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Leave community (User)
export const leaveCommunity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const community = await prisma.community.findUnique({
      where: { id }
    });

    if (!community) {
      res.status(404).json({ message: "Community not found." });
      return;
    }

    const userCommunityRecord = await prisma.userCommunities.findUnique({
      where: {
        userId_communityId: {
          userId: userId,
          communityId: id
        }
      }
    });

    if (!userCommunityRecord) {
      res.status(404).json({ message: "User is not a member of this community." });
      return;
    }

    await prisma.userCommunities.delete({
      where: {
        userId_communityId: {
          userId: userId,
          communityId: id
        }
      }
    });

    res.status(200).json({ message: "User successfully left the community." });
  } catch (error: any) {
    console.error("Error leaving community:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const removeNGOFromCommunity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
      const community = await prisma.community.findUnique({
          where: { id },
          select: { ngoId: true }
      });

      if (!community) {
          res.status(404).json({ message: "Community not found." });
          return;
      }

      if (!community.ngoId) {
          res.status(400).json({ message: "This community doesn't have an NGO to remove." });
          return;
      }

      await prisma.community.update({
          where: { id },
          data: { ngoId: null }
      });

      res.status(200).json({ message: "NGO successfully removed from the community." });
  } catch (error: any) {
      console.error("Error removing NGO from community:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};
// Delete community
export const deleteCommunity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Get communityId from route params

  try {
    const community = await prisma.community.findUnique({
      where: { id }
    });

    if (!community) {
      res.status(404).json({ message: "Community not found." });
      return;
    }

    await prisma.community.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: "Successfully deleted the community and related memberships." });
  } catch (error: any) {
    console.error("Error deleting community:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};