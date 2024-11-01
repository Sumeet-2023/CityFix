import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.community.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
    const {
      projectTag,
      projectName,
      creatorID,
      description,
      contactInfo,
      communityId,
    } = req.body;
  
    try {
      const newProject = await prisma.project.create({
        data: {
          projectTag,
          projectName,
          creatorID,
          description,
          contactInfo,
          communityId,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "ACTIVE",
        },
      });
      res.status(201).json(newProject);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error creating an project: ${error.message}` });
    }
};