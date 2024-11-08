import { Request, Response } from "express";
import { CommunityRoles, PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: id },
      include: {
        community: true,
        members: true,
      }
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.json(project);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving project: ${error.message}` });
  }
};

export const getProjectByCommunityId = async (req: Request, res: Response): Promise<void> => {
  const {communityId} = req.params;

  try{
    const projects = await prisma.project.findMany({
      where: {communityId: communityId}
    })

    res.status(200).json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
}

export const getProjectsByCommunityWithFilter = async (req: Request, res: Response): Promise<void> => {
  const { communityId } = req.params;
  const { userId, filterType } = req.query;

  try {
    const baseCondition = { communityId: communityId };

    let filterCondition = {};

    if (filterType === 'all') {
      filterCondition = baseCondition;
    } else if (filterType === 'userProjects') {
      filterCondition = {
        ...baseCondition,
        members: {
          some: {
            userId: String(userId)
          }
        }
      };
    } else if (filterType === 'nonMemberProjects') {
      filterCondition = {
        ...baseCondition,
        creatorID: {
          not: String(userId)
        },
        members: {
          none: {
            userId: String(userId)
          }
        },
        
      };
    } else if (filterType === 'userCreatedProjects') {
      filterCondition = {
        ...baseCondition,
        creatorID: String(userId)
      };
    } else if (filterType === 'activeProjects') {
      filterCondition = {
        ...baseCondition,
        status: 'ACTIVE'
      };
    } else if (filterType === 'ongoingProjects') {
      filterCondition = {
        ...baseCondition,
        status: 'ONGOING'
      };
    }

    const projects = await prisma.project.findMany({
      where: filterCondition,
      include: {
        members: true,
        creator: true,
      }
    });

    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving projects: ${error.message}` });
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
      },
    });

    await prisma.userProject.create({
      data: {
        userId: creatorID,
        projectId: newProject.id,
      },
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating an project: ${error.message}` });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    projectTag,
    projectName,
    description,
    contactInfo,
    status,
    userId,
    communityId
  } = req.body;

  try {
    const data: any = {};

    if (projectTag) data.projectTag = projectTag;
    if (projectName) data.projectName = projectName;
    if (description) data.description = description;
    if (contactInfo) data.contactInfo = contactInfo;
    // if (status) data.status = status;

    if (status) {
      if (!userId || !communityId){
        res.status(404).json({message: "You can't change status without providing user & community id's!"});
        return
      }
      const rel = await prisma.userCommunities.findUnique({
        where: {
          userId_communityId: {
            userId: userId,
            communityId: communityId
          }
        }
      });
      if (rel?.role === CommunityRoles.MEMBER) {
        res.status(403).json({message: "You need to be a creator or a coordinator to change a project's status"});
        return
      } else {
        data.status = status
      }
    }

    data.updatedAt = new Date();

    const updatedProject = await prisma.project.update({
      where: { id: id },
      data: data,
    });

    res.json(updatedProject);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(500).json({ message: `Error updating project: ${error.message}` });
  }
};


export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { userId, projectId } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (project.creatorID !== userId) {
      res.status(403).json({ message: "Unauthorized: Only the creator can delete this project" });
      return;
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res
      .status(500)
      .json({ message: `Error deleting project: ${error.message}` });
  }
};

export const deleteCommunityProject = async (req: Request, res: Response): Promise<void> => {
  const {projectId} = req.params;
  const {userId, communityId} = req.body;

  try{
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    const community = await prisma.userCommunities.findUnique({
      where: {
        userId_communityId: {
          communityId: communityId,
          userId: userId
        }
      }
    })

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (community?.role !== CommunityRoles.COORDINATOR && community?.role !== CommunityRoles.CREATOR) {
      res.status(403).json({ message: "Unauthorized: Only the authorities can delete this project" });
      return;
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res
      .status(500)
      .json({ message: `Error deleting project: ${error.message}` });
  }
}

export const joinProject = async (req: Request, res: Response): Promise<void> => {
  const {
    userId,
    projectId
  } = req.body;

  try {
    await prisma.userProject.create({
      data: {
        userId: userId,
        projectId: projectId
      }
    });
    res.status(200).json({ message: 'Successfully joined the project' });
  } catch (error: any) {
    res.status(500).json({ message: `Error joining the project: ${error.message}` });
  }
};

export const joinCommunityProject = async (req: Request, res: Response): Promise<void> => {
  const { userId, projectId, communityId } = req.body;

  try {
    // Check if the number of members in the community is more than half
    const communityMemberCount = await prisma.userCommunities.count({
      where: {
        communityId: communityId
      },
    });

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select:{
        members: true,
        status: true
      }
    });

    if ( project?.members &&(project?.members.length + 2 > (communityMemberCount / 2)) && project.status !== ProjectStatus.ACTIVE) {
      console.log(project.status)
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          status: 'ACTIVE',
          updatedAt: new Date()
        },
      });
    }

    await prisma.userProject.create({
      data: {
        userId: userId,
        projectId: projectId,
      },
    });

    res.status(200).json({ message: 'Successfully joined the project', count: communityMemberCount, projectCount: project?.members.length});
  } catch (error: any) {
    res.status(500).json({ message: `Error joining the project: ${error.message}` });
  }
};

export const leaveProject = async (req: Request, res: Response): Promise<void> => {
  const { userId, projectId } = req.body;

  try {
    // commented out logic for making projects inactive. 
    // I think we should let the decision making for this to be done by coordinators or creator
    // const communityMemberCount = await prisma.userProject.count({
    //   where: {
    //     projectId: projectId
    //   },
    // });

    // const project = await prisma.project.findUnique({
    //   where: {
    //     id: projectId,
    //   },
    //   select:{
    //     members: true,
    //     status: true
    //   }
    // });

    // if ( project?.members && (communityMemberCount - 1 < project?.members.length / 2) && project.status !== ProjectStatus.INACTIVE) {
    //   await prisma.project.update({
    //     where: {
    //       id: projectId,
    //     },
    //     data: {
    //       status: 'INACTIVE',
    //     },
    //   });
    // }
    await prisma.userProject.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      }
    });
    res.status(200).json({ message: 'Successfully left the project' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "User is not a member of this project" });
      return;
    }
    res.status(500).json({ message: `Error leaving the project: ${error.message}` });
  }
};

export const getProjectMembers = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  try {
    const members = await prisma.userProject.findMany({
      where: {
        id: projectId
      },
      include: {
        User: {
          select: {
            id: true, 
            email: true,
            username: true
          }
        }
      }
    });
    res.status(200).json(members);
  } catch (error: any) {
    res.status(500).json({ message: `Error fetching project members: ${error.message}` });
  }
};

export const getUserProjects = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const projects = await prisma.user.findMany({
      where: {
        id: userId
      },
      include: {
        projectsJoined: true
      }
    });
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: `Error fetching user's projects: ${error.message}` });
  }
};

export const checkProjectMembership = async (req: Request, res: Response): Promise<void> => {
  const { userId, projectId } = req.params;

  try {
    const membership = await prisma.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      }
    });

    res.status(200).json({
      isMember: !!membership
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error checking project membership: ${error.message}` });
  }
};
