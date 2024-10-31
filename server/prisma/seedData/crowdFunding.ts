import { ObjectId } from 'bson';
import { dataStore } from './dataStore';
import { FundingType } from '@prisma/client';

// Assuming "project1" and "clan1" are existing projects and clans in your dataStore
const project1Id = dataStore.projects.get("Elder Support Services");
const clan1Id = dataStore.clans.get("GOTHEARTH");

if (!project1Id) {
  throw new Error("Project 'project1' not found in dataStore.");
}

if (!clan1Id) {
  throw new Error("Clan 'clan1' not found in dataStore.");
}

export const crowdsourceFundings = [
  {
    id: new ObjectId().toHexString(),
    type: FundingType.PROJECT,
    amountRaised: 5000,
    amountRequired: 10000,
    dateCreated: new Date(),
    lastUpdated: new Date(),
    creatorType: FundingType.PROJECT,
    projectId: project1Id,
    clanId: null, // No clan associated
  },
  {
    id: new ObjectId().toHexString(),
    type: FundingType.CLAN,
    amountRaised: 2500,
    amountRequired: 5000,
    dateCreated: new Date(),
    lastUpdated: new Date(),
    creatorType: FundingType.CLAN,
    projectId: null, // No project associated
    clanId: clan1Id,
  },
  {
    id: new ObjectId().toHexString(),
    type: FundingType.PROJECT,
    amountRaised: 3000,
    amountRequired: 15000,
    dateCreated: new Date(),
    lastUpdated: new Date(),
    creatorType: FundingType.PROJECT,
    projectId: project1Id,
    clanId: null,
  },
  {
    id: new ObjectId().toHexString(),
    type: FundingType.CLAN,
    amountRaised: 700,
    amountRequired: 3000,
    dateCreated: new Date(),
    lastUpdated: new Date(),
    creatorType: FundingType.CLAN,
    projectId: null,
    clanId: clan1Id,
  },
  {
    id: new ObjectId().toHexString(),
    type: FundingType.PROJECT,
    amountRaised: 1200,
    amountRequired: 5000,
    dateCreated: new Date(),
    lastUpdated: new Date(),
    creatorType: FundingType.PROJECT,
    projectId: project1Id,
    clanId: null,
  },
];

// Store the generated crowdsource funding IDs in dataStore for later reference (if needed)
crowdsourceFundings.forEach(funding => {
  dataStore.fundings.set(funding.id, funding.projectId);
});
