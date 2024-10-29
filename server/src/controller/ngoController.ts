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