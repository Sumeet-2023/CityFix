import { Request, Response } from "express";
import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export const getIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        user: true,
        proposals: true,
        resolution: true,
      },
    });
    res.json(issues);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving issues: ${error.message}` });
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
      },
      include: {
        user: true,
      },
    });
    res.status(201).json(newIssue);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating an issue: ${error.message}` });
  }
};

export const getIssueById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        user: true,
        proposals: {
          include: {
            user: true,
            community: true,
          },
        },
        resolution: {
          include: {
            user: true,
            community: true,
          },
        },
      },
    });

    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    res.json(issue);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving issue: ${error.message}` });
  }
};

export const updateIssue = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    issueTag,
    issueName,
    issueDescription,
    location,
    status,
    lastUpdated,
    issuePhotos
  } = req.body;

  const updateData: any = {};
  
  if (issueTag) updateData.issueTag = issueTag;
  if (issueName) updateData.issueName = issueName;
  if (issueDescription) updateData.issueDescription = issueDescription;
  if (location) updateData.location = location;
  if (status) updateData.status = status;
  if (lastUpdated) updateData.lastUpdated = lastUpdated;
  if (issuePhotos) updateData.issuePhotos = { push: issuePhotos };

  try {
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        proposals: true,
        resolution: true,
      },
    });

    res.json(updatedIssue);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating issue: ${error.message}` });
  }
};

export const deleteIssue = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.issue.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting issue: ${error.message}` });
  }
};

export const getIssuesByUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const issues = await prisma.issue.findMany({
      where: { userId },
      include: {
        user: true,
        proposals: true,
        resolution: true,
      },
      orderBy: {
        reportedDate: 'desc',
      },
    });

    res.json(issues);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving user issues: ${error.message}` });
  }
};

export const getIssuesByStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.params;

  try {
    const issues = await prisma.issue.findMany({
      where: { status: status as Status },
      include: {
        user: true,
        proposals: true,
        resolution: true,
      },
      orderBy: {
        lastUpdated: 'desc',
      },
    });

    res.json(issues);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving issues by status: ${error.message}` });
  }
};

export const addProposalToIssue = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { 
    proposalDescription, 
    resolverType,
    userId,
    communityId 
  } = req.body;

  try {
    const proposal = await prisma.resolutionProposal.create({
      data: {
        proposalDescription,
        resolverType,
        userId,
        communityId,
        issueId: id,
      },
      include: {
        user: true,
        community: true,
      },
    });

    res.status(201).json(proposal);
  } catch (error: any) {
    res.status(500).json({ message: `Error adding proposal: ${error.message}` });
  }
};

export const acceptResolution = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { 
    description,
    resolverType,
    userId,
    communityId 
  } = req.body;

  try {
    const resolution = await prisma.$transaction(async (prisma) => {
      // Create the accepted resolution
      const acceptedResolution = await prisma.acceptedIssueResolution.create({
        data: {
          description,
          resolverType,
          userId,
          communityId,
          issueId: id,
        },
        include: {
          user: true,
          community: true,
        },
      });

      // Update the issue status to CLOSED
      await prisma.issue.update({
        where: { id },
        data: { 
          status: Status.CLOSED,
          lastUpdated: new Date(),
        },
      });

      return acceptedResolution;
    });

    res.status(201).json(resolution);
  } catch (error: any) {
    res.status(500).json({ message: `Error accepting resolution: ${error.message}` });
  }
};