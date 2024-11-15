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
const client_1 = require("@prisma/client");
const users_1 = require("./seedData/users");
const ngos_1 = require("./seedData/ngos");
const projects_1 = require("./seedData/projects");
const clan_1 = require("./seedData/clan");
const community_1 = require("./seedData/community");
const issues_1 = require("./seedData/issues");
const userProjects_1 = require("./seedData/userProjects");
const userClan_1 = require("./seedData/userClan");
const userCommunities_1 = require("./seedData/userCommunities");
const crowdFunding_1 = require("./seedData/crowdFunding");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.userCommunities.deleteMany({}); // Delete community memberships
            yield prisma.userProject.deleteMany({}); // Delete project memberships
            yield prisma.userClan.deleteMany({}); // Delete clan memberships
            yield prisma.userNgo.deleteMany({});
            yield prisma.notification.deleteMany({});
            yield prisma.counter.deleteMany({});
            yield prisma.issue.deleteMany({});
            yield prisma.community.deleteMany({});
            yield prisma.ngo.deleteMany({});
            yield prisma.clan.deleteMany({});
            yield prisma.user.deleteMany({});
            yield prisma.project.deleteMany({});
            console.log("Previous documents deleted successfully.");
            const counters = [
                { modelName: client_1.Prisma.ModelName.Issue, count: 15 },
                { modelName: client_1.Prisma.ModelName.Community, count: 1 },
                { modelName: client_1.Prisma.ModelName.Clan, count: 0 },
                { modelName: client_1.Prisma.ModelName.Ngo, count: 0 },
            ];
            for (const counterData of counters) {
                yield prisma.counter.upsert({
                    where: { modelName: counterData.modelName },
                    update: {},
                    create: counterData,
                });
            }
            console.log("Counters seeded successfully.");
            // Seed clans
            for (const clanData of clan_1.clans) {
                yield prisma.clan.create({
                    data: Object.assign({}, clanData),
                });
            }
            console.log("Clans seeded!");
            // Seed Users
            for (const userData of users_1.users) {
                yield prisma.user.create({
                    data: Object.assign({}, userData),
                });
            }
            console.log("Users seeded!");
            // Seed NGOs
            for (const ngoData of ngos_1.ngos) {
                yield prisma.ngo.create({
                    data: Object.assign({}, ngoData),
                });
            }
            console.log("NGOs seeded!");
            // Seed communities
            for (const communityData of community_1.communities) {
                yield prisma.community.create({
                    data: Object.assign({}, communityData),
                });
            }
            console.log("Communites seeded!");
            for (const projectData of projects_1.projects) {
                yield prisma.project.create({
                    data: Object.assign({}, projectData)
                });
            }
            console.log("projects seeded!");
            // Seed User Projects Relationships
            for (const userProjectData of userProjects_1.userProjects) {
                yield prisma.userProject.create({
                    data: Object.assign({}, userProjectData),
                });
            }
            console.log("User Projects relationships seeded!");
            // Seed Issues
            for (const issueData of issues_1.issues) {
                yield prisma.issue.create({
                    data: Object.assign({}, issueData),
                });
            }
            console.log("Issues seeded!");
            for (const fundData of crowdFunding_1.crowdsourceFundings) {
                yield prisma.crowdsourceFunding.create({
                    data: Object.assign({}, fundData)
                });
            }
            console.log("Fundings seeded!");
            for (const userClan of userClan_1.userClans) {
                yield prisma.userClan.create({
                    data: Object.assign({}, userClan)
                });
            }
            console.log("User clan relationships seeded!");
            for (const userCommunity of userCommunities_1.userCommunities) {
                yield prisma.userCommunities.create({
                    data: Object.assign({}, userCommunity)
                });
            }
            console.log("User community relationships seeded!");
            console.log("Seeding completed!");
        }
        catch (error) {
            console.error("Error during seeding:", error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
