import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCrowds = async (req: Request, res: Response): Promise<void> => {
  try {
    const crowds = await prisma.clan.findMany();
    res.json(crowds);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving crowds: ${error.message}` });
  }
};

export const getCrowdById = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.query.id);
  try {
    const crowd = await prisma.clan.findUnique({
      where: {
        id: id,
      }
    });
    res.json(crowd);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving crowds: ${error.message}` });
  }
}

export const createClan = async (req: Request, res: Response): Promise<void> => {
    const {
        creator,               
        clanName,         
        description,      
        location,         
        clanTag,          
    } = req.body;
  
    try {
  
      const newClan = await prisma.clan.create({
        data: {
            creator,
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
        .json({ message: `Error creating an clan: ${error.message}` });
    }
  };
  