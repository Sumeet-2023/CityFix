import { ObjectId } from 'bson';
import { dataStore } from './dataStore';
import { ProjectStatus, ContactInfo } from '@prisma/client';

// Assuming "john_doe" is the user creating these projects
const johnDoeId = dataStore.users.get("john_doe");

if (!johnDoeId) {
  throw new Error("User 'john_doe' not found in dataStore.");
}

export const projects = [
  {
    id: new ObjectId().toHexString(),
    projectName: "Beach Restoration Project",
    description: "Restoring local beach areas and habitats.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "contact@beachproject.com",
      number: "555-1234",
    },
    status: ProjectStatus.ACTIVE,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Green City Initiative",
    description: "Increasing urban green spaces by planting trees.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "greenteam@urbancity.org",
      number: "555-5678",
    },
    status: ProjectStatus.ONGOING,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Recycle for a Better Tomorrow",
    description: "A campaign to promote recycling in urban areas.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "contact@recyclers.com",
      number: "555-8765",
    },
    status: ProjectStatus.ACTIVE,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Save Our Water",
    description: "An initiative focused on water conservation techniques.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "watersavers@houston.org",
      number: "555-3456",
    },
    status: ProjectStatus.ACTIVE,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Road Safety Awareness",
    description: "Community-driven road safety workshops.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "roadsafety@miami.org",
      number: "555-6789",
    },
    status: ProjectStatus.ACTIVE,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Community Green Garden",
    description: "Building a community garden in SF.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "gardenerssf@community.com",
      number: "555-4321",
    },
    status: ProjectStatus.ACTIVE,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Wildlife Protection",
    description: "Protecting wildlife and habitats in Denver.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "wildlife@denveradvocates.org",
      number: "555-7890",
    },
    status: ProjectStatus.ONGOING,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Solar Neighborhoods",
    description: "Encouraging solar adoption in neighborhoods.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "solar@losangeles.org",
      number: "555-9876",
    },
    status: ProjectStatus.ACTIVE,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Austin Forest Reforestation",
    description: "Reforesting and replanting trees in Austin.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "austinreforestation@forest.org",
      number: "555-1234",
    },
    status: ProjectStatus.ONGOING,
    creatorID: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    projectName: "Elder Support Services",
    description: "Supporting elderly people in need.",
    createdAt: new Date(),
    updatedAt: new Date(),
    contactInfo: {
      email: "elderlycare@sd.org",
      number: "555-3214",
    },
    status: ProjectStatus.ACTIVE,
    creatorID: johnDoeId,
  }
];

// Store the generated project IDs in dataStore for later reference (if needed)
projects.forEach(project => {
  dataStore.projects.set(project.projectName, project.id);
  console.assert(`Stored project: ${project.projectName} with ID: ${project.id}`);
});
