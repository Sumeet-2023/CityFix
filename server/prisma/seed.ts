import { PrismaClient } from "@prisma/client";
import { crowds } from "./seedData/crowds";
import { users } from "./seedData/users";
import { ngos } from "./seedData/ngos";
import { projects } from "./seedData/projects";
import { userProjects } from "./seedData/userProjects";
import { issues } from "./seedData/issues"; // Import issues data

const prisma = new PrismaClient();

async function main() {
  try {

    // Delete all documents from each collection before seeding
    await prisma.userProject.deleteMany({});
    await prisma.issue.deleteMany({});
    await prisma.community.deleteMany({});
    await prisma.ngo.deleteMany({});
    await prisma.crowd.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("Previous documents deleted successfully.");

    // Seed Crowds (Clans)
    for (const crowdData of crowds) {
      await prisma.crowd.create({
        data: {
          ...crowdData,
        },
      });
    }
    console.log("Crowds seeded!");

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
          ...ngoData,
        },
      });
    }
    console.log("NGOs seeded!");

    await prisma.counter.create({
      data: {
        modelName: "Issue",
        count: 2,
      },
    });

    // Seed Projects
    for (const projectData of projects) {
      await prisma.community.create({
        data: {
          ...projectData,
        },
      });
    }
    console.log("Projects seeded!");

    // Seed User Projects Relationships
    for (const userProjectData of userProjects) {
      await prisma.userProject.create({
        data: {
          id: userProjectData.id,
          userId: userProjectData.userId,
          projectId: userProjectData.projectId,
        },
      });
    }
    console.log("User Projects relationships seeded!");

    // Seed Issues
    for (const issueData of issues) {
      await prisma.issue.create({
        data: {
          ...issueData,
        },
      });
    }
    console.log("Issues seeded!");

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