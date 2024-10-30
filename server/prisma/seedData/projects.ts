import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

// Assuming "john_doe" is the user creating these projects
const johnDoeId = dataStore.users.get("john_doe");

if (!johnDoeId) {
  throw new Error("User 'john_doe' not found in dataStore.");
}

export const projects = [
  {
    id: new ObjectId().toHexString(),
    projectTag: "Cleanup",
    projectNumber: 1,
    projectName: "Beach Cleanup",
    createdById: johnDoeId,
    projectDescription: "A community project to clean up the beach.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-118.4965, 34.0194] // Santa Monica Beach, CA
    },
    lastUpdated: new Date(),
    volunteerNumber: 10,
    contactInfo: {
      email: "contact@beachcleanup.com",
      number: 1234567890,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "TreePlanting",
    projectNumber: 2,
    projectName: "Urban Tree Planting",
    createdById: johnDoeId,
    projectDescription: "Planting trees in urban areas to improve air quality.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-73.935242, 40.73061] // New York City, NY
    },
    lastUpdated: new Date(),
    volunteerNumber: 20,
    contactInfo: {
      email: "trees@urbangreen.org",
      number: 1234567891,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "Recycling",
    projectNumber: 3,
    projectName: "Neighborhood Recycling Drive",
    createdById: johnDoeId,
    projectDescription: "Encouraging recycling in local neighborhoods.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781] // Chicago, IL
    },
    lastUpdated: new Date(),
    volunteerNumber: 15,
    contactInfo: {
      email: "recycle@neighborhood.org",
      number: 1234567892,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "WaterConservation",
    projectNumber: 4,
    projectName: "Water Conservation Awareness",
    createdById: johnDoeId,
    projectDescription: "Promoting water-saving techniques among residents.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-95.3698, 29.7604] // Houston, TX
    },
    lastUpdated: new Date(),
    volunteerNumber: 25,
    contactInfo: {
      email: "water@savewater.org",
      number: 1234567893,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "RoadSafety",
    projectNumber: 5,
    projectName: "Road Safety Workshop",
    createdById: johnDoeId,
    projectDescription: "A workshop focused on road safety and traffic rules.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-80.1918, 25.7617] // Miami, FL
    },
    lastUpdated: new Date(),
    volunteerNumber: 30,
    contactInfo: {
      email: "roadsafety@safecommute.com",
      number: 1234567894,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "CommunityGardening",
    projectNumber: 6,
    projectName: "Community Gardening Project",
    createdById: johnDoeId,
    projectDescription: "Creating a community garden for fresh produce.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-122.4194, 37.7749] // San Francisco, CA
    },
    lastUpdated: new Date(),
    volunteerNumber: 12,
    contactInfo: {
      email: "gardening@community.org",
      number: 1234567895,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "WildlifeProtection",
    projectNumber: 7,
    projectName: "Wildlife Protection Awareness",
    createdById: johnDoeId,
    projectDescription: "Raising awareness on wildlife protection.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-104.9903, 39.7392] // Denver, CO
    },
    lastUpdated: new Date(),
    volunteerNumber: 18,
    contactInfo: {
      email: "wildlife@protect.org",
      number: 1234567896,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "SolarEnergy",
    projectNumber: 8,
    projectName: "Solar Energy Initiative",
    createdById: johnDoeId,
    projectDescription: "Encouraging the adoption of solar energy in homes.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522] // Los Angeles, CA
    },
    lastUpdated: new Date(),
    volunteerNumber: 22,
    contactInfo: {
      email: "solar@renewablefuture.org",
      number: 1234567897,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "Reforestation",
    projectNumber: 9,
    projectName: "Local Reforestation Effort",
    createdById: johnDoeId,
    projectDescription: "Replanting trees in deforested areas.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-97.7431, 30.2672] // Austin, TX
    },
    lastUpdated: new Date(),
    volunteerNumber: 35,
    contactInfo: {
      email: "reforest@ecoplanet.org",
      number: 1234567898,
    },
  },
  {
    id: new ObjectId().toHexString(),
    projectTag: "ElderlyCare",
    projectNumber: 10,
    projectName: "Community Elderly Care Support",
    createdById: johnDoeId,
    projectDescription: "Providing support to the elderly in the community.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: {
      type: "Point",
      coordinates: [-117.1611, 32.7157] // San Diego, CA
    },
    lastUpdated: new Date(),
    volunteerNumber: 40,
    contactInfo: {
      email: "elderly@communitycare.org",
      number: 1234567899,
    },
  }
];

// Store the generated project IDs in dataStore for later reference (if needed)
projects.forEach(project => {
  dataStore.projects.set(project.projectName, project.id);
});
