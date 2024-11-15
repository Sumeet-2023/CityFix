"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProjectMembership = exports.getUserProjects = exports.getProjectMembers = exports.leaveProject = exports.joinCommunityProject = exports.joinProject = exports.deleteCommunityProject = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectsByCommunityWithFilter = exports.getProjectByCommunityId = exports.getProjectById = exports.getProjects = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma.project.findMany();
        res.json(projects);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving projects: ${error.message}` });
    }
});
exports.getProjects = getProjects;
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield prisma.project.findUnique({
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving project: ${error.message}` });
    }
});
exports.getProjectById = getProjectById;
const getProjectByCommunityId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { communityId } = req.params;
    try {
        const projects = yield prisma.project.findMany({
            where: { communityId: communityId }
        });
        res.status(200).json(projects);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving projects: ${error.message}` });
    }
});
exports.getProjectByCommunityId = getProjectByCommunityId;
const getProjectsByCommunityWithFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { communityId } = req.params;
    const { userId, filterType } = req.query;
    try {
        const baseCondition = { communityId: communityId };
        let filterCondition = {};
        if (filterType === 'all') {
            filterCondition = baseCondition;
        }
        else if (filterType === 'userProjects') {
            filterCondition = Object.assign(Object.assign({}, baseCondition), { members: {
                    some: {
                        userId: String(userId)
                    }
                } });
        }
        else if (filterType === 'nonMemberProjects') {
            filterCondition = Object.assign(Object.assign({}, baseCondition), { creatorID: {
                    not: String(userId)
                }, members: {
                    none: {
                        userId: String(userId)
                    }
                } });
        }
        else if (filterType === 'userCreatedProjects') {
            filterCondition = Object.assign(Object.assign({}, baseCondition), { creatorID: String(userId) });
        }
        else if (filterType === 'activeProjects') {
            filterCondition = Object.assign(Object.assign({}, baseCondition), { status: 'ACTIVE' });
        }
        else if (filterType === 'ongoingProjects') {
            filterCondition = Object.assign(Object.assign({}, baseCondition), { status: 'ONGOING' });
        }
        const projects = yield prisma.project.findMany({
            where: filterCondition,
            include: {
                members: true,
                creator: true,
            }
        });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving projects: ${error.message}` });
    }
});
exports.getProjectsByCommunityWithFilter = getProjectsByCommunityWithFilter;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectTag, projectName, creatorID, description, contactInfo, communityId, } = req.body;
    try {
        const newProject = yield prisma.project.create({
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
        yield prisma.userProject.create({
            data: {
                userId: creatorID,
                projectId: newProject.id,
            },
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating an project: ${error.message}` });
    }
});
exports.createProject = createProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { projectTag, projectName, description, contactInfo, status, userId, communityId } = req.body;
    try {
        const data = {};
        if (projectTag)
            data.projectTag = projectTag;
        if (projectName)
            data.projectName = projectName;
        if (description)
            data.description = description;
        if (contactInfo)
            data.contactInfo = contactInfo;
        // if (status) data.status = status;
        if (status) {
            if (!userId || !communityId) {
                res.status(404).json({ message: "You can't change status without providing user & community id's!" });
                return;
            }
            const rel = yield prisma.userCommunities.findUnique({
                where: {
                    userId_communityId: {
                        userId: userId,
                        communityId: communityId
                    }
                }
            });
            if ((rel === null || rel === void 0 ? void 0 : rel.role) === client_1.CommunityRoles.MEMBER) {
                res.status(403).json({ message: "You need to be a creator or a coordinator to change a project's status" });
                return;
            }
            else {
                data.status = status;
            }
        }
        data.updatedAt = new Date();
        const updatedProject = yield prisma.project.update({
            where: { id: id },
            data: data,
        });
        res.json(updatedProject);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(500).json({ message: `Error updating project: ${error.message}` });
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, projectId } = req.params;
    try {
        const project = yield prisma.project.findUnique({
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
        yield prisma.project.delete({
            where: { id: projectId },
        });
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res
            .status(500)
            .json({ message: `Error deleting project: ${error.message}` });
    }
});
exports.deleteProject = deleteProject;
const deleteCommunityProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { userId, communityId } = req.body;
    try {
        const project = yield prisma.project.findUnique({
            where: { id: projectId },
        });
        const community = yield prisma.userCommunities.findUnique({
            where: {
                userId_communityId: {
                    communityId: communityId,
                    userId: userId
                }
            }
        });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        if ((community === null || community === void 0 ? void 0 : community.role) !== client_1.CommunityRoles.COORDINATOR && (community === null || community === void 0 ? void 0 : community.role) !== client_1.CommunityRoles.CREATOR) {
            res.status(403).json({ message: "Unauthorized: Only the authorities can delete this project" });
            return;
        }
        yield prisma.project.delete({
            where: { id: projectId },
        });
        res.status(204).send();
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res
            .status(500)
            .json({ message: `Error deleting project: ${error.message}` });
    }
});
exports.deleteCommunityProject = deleteCommunityProject;
const joinProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, projectId } = req.body;
    try {
        yield prisma.userProject.create({
            data: {
                userId: userId,
                projectId: projectId
            }
        });
        res.status(200).json({ message: 'Successfully joined the project' });
    }
    catch (error) {
        res.status(500).json({ message: `Error joining the project: ${error.message}` });
    }
});
exports.joinProject = joinProject;
const joinCommunityProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, projectId, communityId } = req.body;
    try {
        // Check if the number of members in the community is more than half
        const communityMemberCount = yield prisma.userCommunities.count({
            where: {
                communityId: communityId
            },
        });
        const project = yield prisma.project.findUnique({
            where: {
                id: projectId,
            },
            select: {
                members: true,
                status: true
            }
        });
        if ((project === null || project === void 0 ? void 0 : project.members) && ((project === null || project === void 0 ? void 0 : project.members.length) + 2 > (communityMemberCount / 2)) && project.status !== client_1.ProjectStatus.ACTIVE) {
            console.log(project.status);
            yield prisma.project.update({
                where: {
                    id: projectId,
                },
                data: {
                    status: 'ACTIVE',
                    updatedAt: new Date()
                },
            });
        }
        yield prisma.userProject.create({
            data: {
                userId: userId,
                projectId: projectId,
            },
        });
        res.status(200).json({ message: 'Successfully joined the project', count: communityMemberCount, projectCount: project === null || project === void 0 ? void 0 : project.members.length });
    }
    catch (error) {
        res.status(500).json({ message: `Error joining the project: ${error.message}` });
    }
});
exports.joinCommunityProject = joinCommunityProject;
const leaveProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield prisma.userProject.delete({
            where: {
                userId_projectId: {
                    userId: userId,
                    projectId: projectId
                }
            }
        });
        res.status(200).json({ message: 'Successfully left the project' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User is not a member of this project" });
            return;
        }
        res.status(500).json({ message: `Error leaving the project: ${error.message}` });
    }
});
exports.leaveProject = leaveProject;
const getProjectMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        const members = yield prisma.userProject.findMany({
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
    }
    catch (error) {
        res.status(500).json({ message: `Error fetching project members: ${error.message}` });
    }
});
exports.getProjectMembers = getProjectMembers;
const getUserProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const projects = yield prisma.user.findMany({
            where: {
                id: userId
            },
            include: {
                projectsJoined: true
            }
        });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ message: `Error fetching user's projects: ${error.message}` });
    }
});
exports.getUserProjects = getUserProjects;
const checkProjectMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, projectId } = req.params;
    try {
        const membership = yield prisma.userProject.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ message: `Error checking project membership: ${error.message}` });
    }
});
exports.checkProjectMembership = checkProjectMembership;
