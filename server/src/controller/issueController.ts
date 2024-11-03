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
export const getFilteredIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, userId, tags } = req.query;

    const whereCondition: any = {
      status: {
        not: 'CLOSED', // Default condition to exclude CLOSED issues
      },
    };

    // Adjust the status filter to allow for multiple values
    if (status) {
      // If the status is a string, convert it to an array for uniformity
      const statusArray = Array.isArray(status) ? status : [status];
      whereCondition.status = {
        in: statusArray,
      };
    }

    if (userId) {
      whereCondition.userId = userId;
    }
    if (tags) {
      whereCondition.tags = {
        some: {
          name: {
            in: Array.isArray(tags) ? tags : [tags],
          },
        },
      };
    }

    const issues = await prisma.issue.findMany({
      where: whereCondition,
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
    authorityNeeds,
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
        authorityNeeds
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
        comments: { // Include comments here
          include: {
            user: true, // Optionally include user information for comments
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
    authorityNeeds,
    issuePhotos
  } = req.body;

  const updateData: any = {};
  
  if (issueTag) updateData.issueTag = issueTag;
  if (issueName) updateData.issueName = issueName;
  if (issueDescription) updateData.issueDescription = issueDescription;
  if (location) updateData.location = location;
  if (status) updateData.status = status;
  if (lastUpdated) updateData.lastUpdated = lastUpdated;
  if (authorityNeeds) updateData.authorityNeeds = authorityNeeds;
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
        _count: {
          select: {
            proposals: true
          }
        }
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

export const getIssueProposals = async (req: Request, res: Response): Promise<void> => {
  const {id} = req.params;
  try {
      const proposal = await prisma.resolutionProposal.findMany({
        where: {
          issueId: id
        }  
      })
      res.json(proposal);
  } catch (error: any) {
    res.status(500).json({message: `Error retreiving issue proposals: ${error.message}`});
  }
}

export const getIssueProposalsCount = async (req: Request, res: Response): Promise<void> => {
  const {id} = req.params;
  try {
    const count = await prisma.resolutionProposal.count({
      where: {
        issueId: id
      }
    })
    res.json(count);
  } catch (error: any) {
    res.status(500).json({message: `Error retrieving count of proposals: ${error.message}`});
  }
}

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



export const postComment = async (req: Request, res: Response): Promise<void> => {
  const { issueId } = req.params; // The ID of the issue from the request parameters
  const { content, userId } = req.body; // Comment content and user ID from the request body

  try {
    // Create a new comment in the database
    const comment = await prisma.comment.create({
      data: {
        content,
        issue: {
          connect: { id: issueId } // Connect the comment to the specified issue
        },
        user: {
          connect: { id: userId } // Connect the comment to the user (optional)
        }
      }
    });

    res.status(201).json(comment); // Respond with the created comment
  } catch (error: any) {
    res.status(500).json({ message: `Error posting comment: ${error.message}` });
  }
};

// Handler to fetch comments for a specific issue
export const getCommentsByIssue = async (req: Request, res: Response): Promise<void> => {
  const { issueId } = req.params; // The ID of the issue from the request parameters

  try {
    // Fetch comments associated with the specified issue
    const comments = await prisma.comment.findMany({
      where: { issueId: issueId }, // Filter by the issue ID
      include: { user: true }, // Optionally include user information
      orderBy: { createdAt: 'desc' }, // Order comments by creation date
    });

    res.json(comments); // Respond with the list of comments
  } catch (error: any) {
    res.status(500).json({ message: `Error fetching comments: ${error.message}` });
  }
};