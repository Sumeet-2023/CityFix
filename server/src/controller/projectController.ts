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
        createdById,      
        projectDescription,
        reportedDate,     
        reportedTime,     
        executionDate,    
        executionTime,    
        location,         
        lastUpdated,      
        volunteerNumber,  
        contactInfo,      
    } = req.body;
  
    try {
      // Get and increment the latest count for Issue model
      const updatedCounter = await prisma.counter.update({
        where: { modelName: "Community" },
        data: { count: { increment: 1 } },
      });
  
      // Use the updated count as the issueNumber
      const projectNumber = updatedCounter.count;
  
      // Create the issue with the generated issueNumber
      const newProject = await prisma.community.create({
        data: {
        projectTag,       
        projectNumber,    
        projectName,
        createdById,      
        projectDescription,
        reportedDate,     
        reportedTime,     
        executionDate,    
        executionTime,    
        location,         
        lastUpdated,      
        volunteerNumber,  
        contactInfo,
        },
      });
      res.status(201).json(newProject);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error creating an project: ${error.message}` });
    }
};