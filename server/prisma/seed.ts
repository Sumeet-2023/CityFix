import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      username: "john_doe",
      location: "New York",
      followerCount: 100,
      followingCount: 150,
      points: 200,
      paid: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "jane_smith",
      location: "Los Angeles",
      followerCount: 50,
      followingCount: 75,
      points: 120,
      paid: false,
    },
  });

  // Seed Crowd (Clan)
  const clan = await prisma.crowd.create({
    data: {
      clanName: "Green Warriors",
      badge: null,
      description: "A clan for nature lovers",
      clanType: "Open",
      peopleJoinedNumber: 1,
      location: "California",
      clanTag: "GW1234",
      peopleJoined: {
        connect: [{ id: user1.id }],
      },
    },
  });

  // Seed Issues
  const issue1 = await prisma.issue.create({
    data: {
      issueTag: "Environmental",
      issueNumber: 101,
      issueName: "Trash on Beach",
      user: {
        connect: { id: user1.id },
      },
      issueDescription: "Trash is piling up on Santa Monica Beach.",
      reportedDate: new Date(),
      location: "Santa Monica Beach",
      lastUpdated: new Date(),
    },
  });

  // Seed Community Projects
  const project1 = await prisma.community.create({
    data: {
      projectTag: "Cleanup",
      projectNumber: 1,
      projectName: "Beach Cleanup",
      createdBy: {
        connect: { id: user1.id },
      },
      projectDescription: "A community project to clean up the beach.",
      reportedDate: new Date(),
      reportedTime: new Date(),
      executionDate: new Date(),
      executionTime: new Date(),
      location: "Santa Monica Beach",
      lastUpdated: new Date(),
      volunteerNumber: 10,
      contactInfo: {
        email: "contact@beachcleanup.com",
        number: 1234567890,
      },
    },
  });

  // Seed NGO
  const ngo1 = await prisma.ngo.create({
    data: {
      ngoName: "Nature's Helpers",
      ngoType: "Environmental",
      ngoPhotoUrl: null,
      ngoDescription: "NGO dedicated to keeping nature clean.",
      contact: {
        email: "info@natureshelpers.org",
        number: 9876543210,
      },
      raisedMoney: 5000,
    },
  });

  // Seed UserProject (Many-to-Many Relationship between User and Community)
  await prisma.userProject.create({
    data: {
      userId: user1.id,
      projectId: project1.id,
    },
  });

  await prisma.userProject.create({
    data: {
      userId: user2.id,
      projectId: project1.id,
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
