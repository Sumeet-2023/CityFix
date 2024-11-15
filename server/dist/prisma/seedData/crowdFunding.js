"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crowdsourceFundings = void 0;
const bson_1 = require("bson");
const dataStore_1 = require("./dataStore");
const client_1 = require("@prisma/client");
const project1Id = dataStore_1.dataStore.projects.get("Elder Support Services");
const clan1Id = dataStore_1.dataStore.clans.get("GOTHEARTH");
if (!project1Id) {
    throw new Error("Project 'project1' not found in dataStore.");
}
if (!clan1Id) {
    throw new Error("Clan 'clan1' not found in dataStore.");
}
exports.crowdsourceFundings = [
    {
        id: new bson_1.ObjectId().toHexString(),
        type: client_1.FundingType.PROJECT,
        amountRaised: 5000,
        amountRequired: 10000,
        dateCreated: new Date(),
        lastUpdated: new Date(),
        creatorType: client_1.FundingType.PROJECT,
        projectId: project1Id,
        clanId: null, // No clan associated
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        type: client_1.FundingType.CLAN,
        amountRaised: 2500,
        amountRequired: 5000,
        dateCreated: new Date(),
        lastUpdated: new Date(),
        creatorType: client_1.FundingType.CLAN,
        projectId: null, // No project associated
        clanId: clan1Id,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        type: client_1.FundingType.PROJECT,
        amountRaised: 3000,
        amountRequired: 15000,
        dateCreated: new Date(),
        lastUpdated: new Date(),
        creatorType: client_1.FundingType.PROJECT,
        projectId: project1Id,
        clanId: null,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        type: client_1.FundingType.CLAN,
        amountRaised: 700,
        amountRequired: 3000,
        dateCreated: new Date(),
        lastUpdated: new Date(),
        creatorType: client_1.FundingType.CLAN,
        projectId: null,
        clanId: clan1Id,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        type: client_1.FundingType.PROJECT,
        amountRaised: 1200,
        amountRequired: 5000,
        dateCreated: new Date(),
        lastUpdated: new Date(),
        creatorType: client_1.FundingType.PROJECT,
        projectId: project1Id,
        clanId: null,
    },
];
// Store the generated crowdsource funding IDs in dataStore for later reference (if needed)
exports.crowdsourceFundings.forEach(funding => {
    dataStore_1.dataStore.fundings.set(funding.id, funding.projectId);
});
