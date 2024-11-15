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
exports.getCommentsByIssue = exports.postComment = exports.acceptResolution = exports.deleteProposal = exports.addProposalToIssue = exports.getIssueProposalsCount = exports.getIssueProposals = exports.getIssuesByStatus = exports.getIssuesByUser = exports.deleteIssue = exports.updateIssue = exports.getIssueById = exports.createIssue = exports.getFilteredIssues = exports.getIssues = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issues = yield prisma.issue.findMany({
            include: {
                user: true,
                proposals: true,
                resolution: true,
            },
        });
        res.json(issues);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving issues: ${error.message}` });
    }
});
exports.getIssues = getIssues;
const getFilteredIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, userId, tags } = req.query;
        const whereCondition = {
            status: {
                not: 'DENIED', // Default condition to exclude CLOSED issues
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
        const issues = yield prisma.issue.findMany({
            where: whereCondition,
            include: {
                user: true,
                proposals: true,
                resolution: true,
            },
        });
        res.json(issues);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving issues: ${error.message}` });
    }
});
exports.getFilteredIssues = getFilteredIssues;
const createIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issueTag, issueName, userId, issueDescription, reportedDate, location, authorityNeeds,
    // issuePhotos
     } = req.body;
    try {
        // Get and increment the latest count for Issue model
        const updatedCounter = yield prisma.counter.update({
            where: { modelName: "Issue" },
            data: { count: { increment: 1 } },
        });
        // Use the updated count as the issueNumber
        const issueNumber = updatedCounter.count;
        // Create the issue with the generated issueNumber
        const newIssue = yield prisma.issue.create({
            data: {
                issueTag,
                issueNumber,
                issueName,
                userId,
                issueDescription,
                reportedDate,
                location,
                authorityNeeds,
                // issuePhotos: issuePhotos || null
            },
            include: {
                user: true,
            },
        });
        yield prisma.user.update({
            where: { id: userId },
            data: {
                points: { increment: 10 }, // Increase by 10 points for creating an issue
            },
        });
        res.status(201).json(newIssue);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating an issue: ${error.message}` });
    }
});
exports.createIssue = createIssue;
const getIssueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const issue = yield prisma.issue.findUnique({
            where: { id },
            include: {
                user: true,
                proposals: {
                    include: {
                        user: true,
                    },
                },
                resolution: {
                    include: {
                        user: true,
                    },
                },
                comments: {
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
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving issue: ${error.message}` });
    }
});
exports.getIssueById = getIssueById;
const updateIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { issueTag, issueName, issueDescription, location, status, lastUpdated, authorityNeeds, issuePhotos } = req.body;
    const updateData = {};
    if (issueTag)
        updateData.issueTag = issueTag;
    if (issueName)
        updateData.issueName = issueName;
    if (issueDescription)
        updateData.issueDescription = issueDescription;
    if (location)
        updateData.location = location;
    if (status)
        updateData.status = status;
    if (lastUpdated)
        updateData.lastUpdated = lastUpdated;
    if (authorityNeeds)
        updateData.authorityNeeds = authorityNeeds;
    if (issuePhotos)
        updateData.issuePhotos = { push: issuePhotos };
    try {
        const updatedIssue = yield prisma.issue.update({
            where: { id },
            data: updateData,
            include: {
                user: true,
                proposals: true,
                resolution: true,
            },
        });
        res.json(updatedIssue);
    }
    catch (error) {
        res.status(500).json({ message: `Error updating issue: ${error.message}` });
    }
});
exports.updateIssue = updateIssue;
const deleteIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.issue.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: `Error deleting issue: ${error.message}` });
    }
});
exports.deleteIssue = deleteIssue;
const getIssuesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const issues = yield prisma.issue.findMany({
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
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving user issues: ${error.message}` });
    }
});
exports.getIssuesByUser = getIssuesByUser;
const getIssuesByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.params;
    try {
        const issues = yield prisma.issue.findMany({
            where: { status: status },
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
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving issues by status: ${error.message}` });
    }
});
exports.getIssuesByStatus = getIssuesByStatus;
const getIssueProposals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const proposals = yield prisma.resolutionProposal.findMany({
            where: {
                issueId: id,
            },
            include: {
                user: true, // Including user info for proposer details
            },
        });
        res.json(proposals);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving issue proposals: ${error.message}` });
    }
});
exports.getIssueProposals = getIssueProposals;
const getIssueProposalsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const count = yield prisma.resolutionProposal.count({
            where: {
                issueId: id
            }
        });
        res.json(count);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving count of proposals: ${error.message}` });
    }
});
exports.getIssueProposalsCount = getIssueProposalsCount;
const addProposalToIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // `id` represents the issue ID
    const { proposalDescription, resolverType, // AUTHORITY or USER
    userId } = req.body;
    try {
        // Validate that `userId` is provided
        if (!userId) {
            res.status(400).json({ message: "userId must be provided." });
            return;
        }
        // Create a new proposal linked to the issue
        const proposal = yield prisma.resolutionProposal.create({
            data: {
                proposalDescription,
                resolverType,
                userId,
                issueId: id, // Link this proposal to the specific issue
            },
            include: {
                user: true,
            },
        });
        yield prisma.issue.update({
            where: { id },
            data: { status: client_1.Status.IN_PROGRESS },
        });
        const issue = yield prisma.issue.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
        // Ensure the issue exists and has a user associated
        if (issue && issue.user) {
            // Create a notification for the issue owner
            yield prisma.notification.create({
                data: {
                    userId: issue.user.id, // The user who should receive the notification
                    type: 'PROPOSAL_SUBMITTED', // Enum value for notification type
                    message: `${(_a = proposal.user) === null || _a === void 0 ? void 0 : _a.username} has submitted a proposal for your issue "${issue.issueName}".`,
                    proposalId: proposal.id, // Link to the proposal
                    createdAt: new Date(),
                },
            });
        }
        res.status(201).json(proposal);
    }
    catch (error) {
        res.status(500).json({ message: `Error adding proposal: ${error.message}` });
    }
});
exports.addProposalToIssue = addProposalToIssue;
const deleteProposal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { proposalId } = req.params;
    try {
        // Check if the proposal exists
        const existingProposal = yield prisma.resolutionProposal.findUnique({
            where: { id: proposalId },
        });
        if (!existingProposal) {
            res.status(404).json({ message: "Proposal not found." });
            return;
        }
        // Delete the proposal
        yield prisma.resolutionProposal.delete({
            where: { id: proposalId },
        });
        res.status(200).json({ message: "Proposal deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting proposal:", error);
        res.status(500).json({ message: `Error deleting proposal: ${error.message}` });
    }
});
exports.deleteProposal = deleteProposal;
const acceptResolution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { proposalId } = req.params; // Use `proposalId` to identify the proposal
    const { description, resolverType, userId, } = req.body;
    // Debugging: Ensure all required fields are present
    if (!proposalId || !description || !resolverType || !userId) {
        res.status(400).json({ message: "Missing required fields: proposalId, description, resolverType, and userId are all required." });
        return;
    }
    try {
        // Find the proposal by ID
        const proposal = yield prisma.resolutionProposal.findUnique({
            where: { id: proposalId },
        });
        // If the proposal does not exist, return a 404 response
        if (!proposal) {
            res.status(404).json({ message: "Resolution proposal not found." });
            return;
        }
        // Retrieve the issue ID from the proposal
        const issueId = proposal.issueId;
        // Check if the issue exists
        const existingIssue = yield prisma.issue.findUnique({
            where: { id: issueId },
        });
        // If the issue does not exist, return a 404 response
        if (!existingIssue) {
            res.status(404).json({ message: "Issue not found." });
            return;
        }
        // Ensure the user exists (optional but recommended)
        const existingUser = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Create the accepted resolution entry
        const acceptedResolution = yield prisma.acceptedIssueResolution.create({
            data: {
                description,
                resolverType,
                userId,
                issueId,
            },
            include: {
                user: true,
            },
        });
        // Update the issue status to CLOSED
        yield prisma.issue.update({
            where: { id: issueId },
            data: {
                status: client_1.Status.CLOSED,
                lastUpdated: new Date(),
            },
        });
        yield prisma.user.update({
            where: { id: userId },
            data: {
                points: { increment: 40 }, // Increase by 40 points for resolving an issue
            },
        });
        res.status(201).json(acceptedResolution);
    }
    catch (error) {
        console.error('Error accepting resolution:', error);
        res.status(500).json({ message: `Error accepting resolution: ${error.message}` });
    }
});
exports.acceptResolution = acceptResolution;
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issueId } = req.params; // The ID of the issue from the request parameters
    const { content, userId } = req.body; // Comment content and user ID from the request body
    try {
        // Create a new comment in the database
        const comment = yield prisma.comment.create({
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
    }
    catch (error) {
        res.status(500).json({ message: `Error posting comment: ${error.message}` });
    }
});
exports.postComment = postComment;
// Handler to fetch comments for a specific issue
const getCommentsByIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { issueId } = req.params; // The ID of the issue from the request parameters
    try {
        // Fetch comments associated with the specified issue
        const comments = yield prisma.comment.findMany({
            where: { issueId: issueId }, // Filter by the issue ID
            include: { user: true }, // Optionally include user information
            orderBy: { createdAt: 'desc' }, // Order comments by creation date
        });
        res.json(comments); // Respond with the list of comments
    }
    catch (error) {
        res.status(500).json({ message: `Error fetching comments: ${error.message}` });
    }
});
exports.getCommentsByIssue = getCommentsByIssue;
