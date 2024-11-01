import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface StatusMessage {
  code: number;
  message: string;
}

// Create NGO
export const createNgo = async (req: Request, res: Response): Promise<void> => {
  const {
    ngoName,
    description,
    contact,
    creatorId
  } = req.body;
  try {
    await prisma.ngo.create({
      data: {
        ngoName,
        description,
        contact,
        creatorId
      }
    });
    res.status(200).json({ message: "Successfully created ngo!" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Failed to create ngo! ${error.message}` });
  }
};

// Get all NGOs
export const getAllNgos = async (req: Request, res: Response): Promise<void> => {
  try {
    const ngos = await prisma.ngo.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        }
      }
    });
    res.status(200).json(ngos);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Failed to fetch ngos! ${error.message}` });
  }
};

// Get NGO by ID
export const getNgoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const ngo = await prisma.ngo.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        },
        community: true
      }
    });

    if (!ngo) {
      res.status(404).json({ message: "NGO not found" });
      return;
    }

    res.status(200).json(ngo);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Failed to fetch ngo! ${error.message}` });
  }
};

// Update NGO
export const updateNgo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    ngoName,
    description,
    contact,
    authorized,
    raisedAmount
  } = req.body;

  try {
    const updatedNgo = await prisma.ngo.update({
      where: { id },
      data: {
        ngoName,
        description,
        contact,
        authorized,
        raisedAmount
      }
    });
    res.status(200).json(updatedNgo);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "NGO not found" });
      return;
    }
    res
      .status(500)
      .json({ message: `Failed to update ngo! ${error.message}` });
  }
};

// Delete NGO
export const deleteNgo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.ngo.delete({
      where: { id }
    });
    res.status(200).json({ message: "Successfully deleted NGO" });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "NGO not found" });
      return;
    }
    res
      .status(500)
      .json({ message: `Failed to delete ngo! ${error.message}` });
  }
};

// Add member to NGO
export const addNgoMember = async (req: Request, res: Response): Promise<void> => {
  const { userId, ngoId } = req.body;
  try {
    await prisma.userNgo.create({
      data: {
        userId,
        ngoId
      }
    });
    res.status(200).json({ message: "Successfully added member to NGO" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Failed to add member to NGO! ${error.message}` });
  }
};

// Remove member from NGO
export const removeNgoMember = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;  // UserNgo id
  try {
    await prisma.userNgo.delete({
      where: { id }
    });
    res.status(200).json({ message: "Successfully removed member from NGO" });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Member not found in NGO" });
      return;
    }
    res
      .status(500)
      .json({ message: `Failed to remove member from NGO! ${error.message}` });
  }
};

// Get NGO members
export const getNgoMembers = async (req: Request, res: Response): Promise<void> => {
  const { ngoId } = req.params;
  try {
    const members = await prisma.userNgo.findMany({
      where: { ngoId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    res.status(200).json(members);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Failed to fetch NGO members! ${error.message}` });
  }
};

// Get user's NGOs
export const getUserNgos = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const ngos = await prisma.userNgo.findMany({
      where: { userId },
      include: {
        ngo: true
      }
    });
    res.status(200).json(ngos);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Failed to fetch user's NGOs! ${error.message}` });
  }
};

// Update NGO raised amount
export const updateRaisedAmount = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const ngo = await prisma.ngo.update({
      where: { id },
      data: {
        raisedAmount: amount
      }
    });
    res.status(200).json(ngo);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "NGO not found" });
      return;
    }
    res
      .status(500)
      .json({ message: `Failed to update raised amount! ${error.message}` });
  }
};

// Toggle NGO authorization
export const toggleAuthorization = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { authorized } = req.body;

  try {
    const ngo = await prisma.ngo.update({
      where: { id },
      data: {
        authorized
      }
    });
    res.status(200).json(ngo);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "NGO not found" });
      return;
    }
    res
      .status(500)
      .json({ message: `Failed to update authorization status! ${error.message}` });
  }
};