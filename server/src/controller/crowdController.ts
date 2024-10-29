import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCrowds = async (req: Request, res: Response): Promise<void> => {
  try {
    const crowds = await prisma.crowd.findMany();
    res.json(crowds);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving crowds: ${error.message}` });
  }
};


export const createClan = async (req: Request, res: Response): Promise<void> => {
    const {               
        clanName,         
        description,      
        clanType,         
        peopleJoinedNumber,
        location,         
        clanTag,          
    } = req.body;
  
    try {
  
      const newClan = await prisma.crowd.create({
        data: {
            clanName,         
            description,      
            clanType,         
            peopleJoinedNumber,
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
  