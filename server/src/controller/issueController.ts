import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const issues = await prisma.issue.findMany();
    res.json(issues);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving issues: ${error.message}` });
  }
};

export const createIssue = async (req: Request, res: Response): Promise<void> => {
  const {
    issueTag,
    issueName,
    userId,
    issueDescription,
    reportedDate,
    location,
    lastUpdated,
  } = req.body;

  try {
    // Get and increment the latest count for Issue model
    const updatedCounter = await prisma.counter.update({
      where: { modelName: "Issue" },
      data: { count: { increment: 1 } },
    });

    // Use the updated count as the issueNumber
    const issueNumber = updatedCounter.count;

    // Create the issue with the generated issueNumber
    const newIssue = await prisma.issue.create({
      data: {
        issueTag,
        issueNumber,
        issueName,
        userId,
        issueDescription,
        reportedDate,
        location,
        lastUpdated,
      },
    });
    res.status(201).json(newIssue);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating an issue: ${error.message}` });
  }
};
