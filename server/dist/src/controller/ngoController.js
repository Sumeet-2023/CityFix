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
exports.toggleAuthorization = exports.updateRaisedAmount = exports.getUserNgos = exports.getNgoMembers = exports.removeNgoMember = exports.addNgoMember = exports.deleteNgo = exports.updateNgo = exports.getNgoById = exports.getAllNgos = exports.createNgo = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create NGO
const createNgo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ngoName, description, contact, creatorId } = req.body;
    try {
        yield prisma.ngo.create({
            data: {
                ngoName,
                description,
                contact,
                creatorId
            }
        });
        res.status(200).json({ message: "Successfully created ngo!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Failed to create ngo! ${error.message}` });
    }
});
exports.createNgo = createNgo;
// Get all NGOs
const getAllNgos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ngos = yield prisma.ngo.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json(ngos);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Failed to fetch ngos! ${error.message}` });
    }
});
exports.getAllNgos = getAllNgos;
// Get NGO by ID
const getNgoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ngo = yield prisma.ngo.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                },
                community: true
            }
        });
        if (!ngo) {
            res.status(404).json({ message: "NGO not found" });
            return;
        }
        res.status(200).json(ngo);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Failed to fetch ngo! ${error.message}` });
    }
});
exports.getNgoById = getNgoById;
// Update NGO
const updateNgo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { ngoName, description, contact, authorized, raisedAmount } = req.body;
    try {
        const updatedNgo = yield prisma.ngo.update({
            where: { id },
            data: {
                ngoName,
                description,
                contact,
                authorized,
                raisedAmount
            }
        });
        res.status(200).json(updatedNgo);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "NGO not found" });
            return;
        }
        res
            .status(500)
            .json({ message: `Failed to update ngo! ${error.message}` });
    }
});
exports.updateNgo = updateNgo;
// Delete NGO
const deleteNgo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.ngo.delete({
            where: { id }
        });
        res.status(200).json({ message: "Successfully deleted NGO" });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "NGO not found" });
            return;
        }
        res
            .status(500)
            .json({ message: `Failed to delete ngo! ${error.message}` });
    }
});
exports.deleteNgo = deleteNgo;
// Add member to NGO
const addNgoMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, ngoId } = req.body;
    try {
        yield prisma.userNgo.create({
            data: {
                userId,
                ngoId
            }
        });
        res.status(200).json({ message: "Successfully added member to NGO" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Failed to add member to NGO! ${error.message}` });
    }
});
exports.addNgoMember = addNgoMember;
// Remove member from NGO
const removeNgoMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // UserNgo id
    try {
        yield prisma.userNgo.delete({
            where: { id }
        });
        res.status(200).json({ message: "Successfully removed member from NGO" });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Member not found in NGO" });
            return;
        }
        res
            .status(500)
            .json({ message: `Failed to remove member from NGO! ${error.message}` });
    }
});
exports.removeNgoMember = removeNgoMember;
// Get NGO members
const getNgoMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ngoId } = req.params;
    try {
        const members = yield prisma.userNgo.findMany({
            where: { ngoId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        res.status(200).json(members);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Failed to fetch NGO members! ${error.message}` });
    }
});
exports.getNgoMembers = getNgoMembers;
// Get user's NGOs
const getUserNgos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const ngos = yield prisma.userNgo.findMany({
            where: { userId },
            include: {
                ngo: true
            }
        });
        res.status(200).json(ngos);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Failed to fetch user's NGOs! ${error.message}` });
    }
});
exports.getUserNgos = getUserNgos;
// Update NGO raised amount
const updateRaisedAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const ngo = yield prisma.ngo.update({
            where: { id },
            data: {
                raisedAmount: amount
            }
        });
        res.status(200).json(ngo);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "NGO not found" });
            return;
        }
        res
            .status(500)
            .json({ message: `Failed to update raised amount! ${error.message}` });
    }
});
exports.updateRaisedAmount = updateRaisedAmount;
// Toggle NGO authorization
const toggleAuthorization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { authorized } = req.body;
    try {
        const ngo = yield prisma.ngo.update({
            where: { id },
            data: {
                authorized
            }
        });
        res.status(200).json(ngo);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "NGO not found" });
            return;
        }
        res
            .status(500)
            .json({ message: `Failed to update authorization status! ${error.message}` });
    }
});
exports.toggleAuthorization = toggleAuthorization;
