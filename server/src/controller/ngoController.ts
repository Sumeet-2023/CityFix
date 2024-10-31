import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNgos = async (req: Request, res: Response): Promise<void> => {
  try {
    const ngos = await prisma.ngo.findMany();
    res.json(ngos);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving ngos: ${error.message}` });
  }
};

export const createNgo = async (req: Request, res: Response): Promise<void> => {
  const {
    ngoName,
    description,
    contact,
    raisedAmount,
    authorized,
    creatorId,
  } = req.body;

  try {
    const newNgo = await prisma.ngo.create({
      data: {
        ngoName,
        description,
        contact,
        raisedAmount,
        authorized,
        createdAt: new Date(),
        creatorId,
      },
    });

    res.status(201).json(newNgo);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating NGO: ${error.message}` });
  }
};
