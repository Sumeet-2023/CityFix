import { PrismaClient, Prisma, Status } from "@prisma/client";
import { users } from "./seedData/users";
import { ngos } from "./seedData/ngos";
import { projects } from "./seedData/projects";
import { clans } from "./seedData/clan";
import { communities } from "./seedData/community";
import { issues } from "./seedData/issues";
import { userProjects } from "./seedData/userProjects";
import { userClans } from "./seedData/userClan";
import { userCommunities } from "./seedData/userCommunities";
import { crowdsourceFundings } from "./seedData/crowdFunding";

const prisma = new PrismaClient();

async function main() {
  try {

    await prisma.userCommunities.deleteMany({}); // Delete community memberships
    await prisma.userProject.deleteMany({}); // Delete project memberships
    await prisma.userClan.deleteMany({}); // Delete clan memberships
    
    await prisma.counter.deleteMany({});
    await prisma.issue.deleteMany({});
    await prisma.community.deleteMany({});
    await prisma.ngo.deleteMany({});
    await prisma.clan.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log("Previous documents deleted successfully.");

    const counters = [
      { modelName: Prisma.ModelName.Issue, count: 16 },
      { modelName: Prisma.ModelName.Community, count: 1 },
      { modelName: Prisma.ModelName.Clan, count: 0 },
      { modelName: Prisma.ModelName.Ngo, count: 0 },
    ];

    for (const counterData of counters) {
      await prisma.counter.upsert({
        where: { modelName: counterData.modelName },
        update: {},
        create: counterData,
      });
    }

    console.log("Counters seeded successfully.");

    // Seed clans
    for (const clanData of clans) {
      await prisma.clan.create({
        data: {
          ...clanData,
        },
      });
    }
    console.log("Clans seeded!");

    // Seed Users
    for (const userData of users) {
      await prisma.user.create({
        data: {
          ...userData,
        },
      });
    }
    console.log("Users seeded!");

    // Seed NGOs
    for (const ngoData of ngos) {
      await prisma.ngo.create({
        data: {
          id: ngoData.id,
          ngoName: ngoData.ngoName,
          description: ngoData.description,
          contact: {
            email: ngoData.contact.email,
            number: ngoData.contact.number,
          },
          raisedAmount: ngoData.raisedAmount,
          authorized: ngoData.authorized,
          createdAt: ngoData.createdAt,
          creatorId: ngoData.creatorId ?? "", // Fallback in case creatorId is undefined
        },
      });
    }
    console.log("NGOs seeded!");

    // Seed communities
    for (const communityData of communities) {
      await prisma.community.create({
        data: {
          id: communityData.id,
          communityName: communityData.communityName,
          communityNumber: communityData.communityNumber,
          description: communityData.description,
          location: communityData.location,
          creatorType: communityData.creatorType,
          creatorId: communityData.creatorId
        },
      });
    }
    console.log("Communites seeded!");

    for (const projectData of projects){
      await prisma.project.create({
        data: {
          ...projectData,
        }
      })
    }
    console.log("projects seeded!");

    // Seed User Projects Relationships
    for (const userProjectData of userProjects) {
      await prisma.userProject.create({
        data: {
          ...userProjectData
        },
      });
    }
    console.log("User Projects relationships seeded!");

    // Seed Issues
    for (const issueData of issues) {
      await prisma.issue.create({
        data: {
          id: issueData.id,
          issueName: issueData.issueName,
          issueNumber: issueData.issueNumber,
          issueDescription: issueData.issueDescription,
          location: issueData.location,
          issueTag: issueData.issueTag,
          reportedDate: issueData.reportedDate,
          lastUpdated: issueData.lastUpdated,
          status: Status.OPEN,
          userId: issueData.userId
        },
      });
    }
    console.log("Issues seeded!");

    for (const fundData of crowdsourceFundings) {
      await prisma.crowdsourceFunding.create({
        data: {
          ...fundData,
        }
      })
    }
    console.log("Fundings seeded!");

    for (const userClan of userClans) {
      await prisma.userClan.create({
        data: {
          ...userClan
        }
      })
    }
    console.log("User clan relationships seeded!");

    for (const userCommunity of userCommunities){
      await prisma.userCommunities.create({
        data:{
          ...userCommunity,
        }
      })
    }
    console.log("User community relationships seeded!");

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });