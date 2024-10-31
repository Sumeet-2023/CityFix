import { ObjectId } from 'bson';
import { dataStore } from './dataStore';
import { communityCreatorType } from '@prisma/client';

// Assuming "john_doe" is the user creating these projects
const johnDoeId = dataStore.users.get("john_doe");
const ngoId = dataStore.ngos.get("Green Earth Initiative")

if (!johnDoeId) {
  throw new Error("User 'john_doe' not found in dataStore.");
}

export const communities = [
  {
    id: new ObjectId().toHexString(),
    communityName: "Beach Cleaners United",
    communityNumber: 1,
    description: "A community focused on keeping beaches clean and litter-free.",
    location: {
      type: "Point",
      coordinates: [-118.4965, 34.0194] // Santa Monica Beach, CA
    },
    creatorType: communityCreatorType.USER,
    creatorId: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Urban Green Team",
    communityNumber: 2,
    description: "Planting trees and creating green spaces in urban areas.",
    location: {
      type: "Point",
      coordinates: [-73.935242, 40.73061] // New York City, NY
    },
    creatorType: communityCreatorType.USER,
    creatorId: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Recyclers of Chicago",
    communityNumber: 3,
    description: "A recycling initiative focused on increasing recycling rates.",
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781] // Chicago, IL
    },
    creatorType: communityCreatorType.USER,
    creatorId: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Houston Water Savers",
    communityNumber: 4,
    description: "Promoting water conservation practices within Houston.",
    location: {
      type: "Point",
      coordinates: [-95.3698, 29.7604] // Houston, TX
    },
    creatorType: communityCreatorType.USER,
    creatorId: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Safe Roads Initiative",
    communityNumber: 5,
    description: "Organizing road safety workshops and awareness campaigns.",
    location: {
      type: "Point",
      coordinates: [-80.1918, 25.7617] // Miami, FL
    },
    creatorType: communityCreatorType.USER,
    creatorId: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Community Gardeners SF",
    communityNumber: 6,
    description: "Creating and maintaining a community garden in San Francisco.",
    location: {
      type: "Point",
      coordinates: [-122.4194, 37.7749] // San Francisco, CA
    },
    creatorType: communityCreatorType.NGO,
    ngoId: ngoId
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Denver Wildlife Advocates",
    communityNumber: 7,
    description: "Raising awareness about wildlife protection in Denver.",
    location: {
      type: "Point",
      coordinates: [-104.9903, 39.7392] // Denver, CO
    },
    creatorType: communityCreatorType.NGO,
    ngoId: ngoId
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Solar Power Pioneers",
    communityNumber: 8,
    description: "Encouraging the adoption of solar energy within the community.",
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522] // Los Angeles, CA
    },
    creatorType: communityCreatorType.USER,
    creatorId: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Austin Reforestation Project",
    communityNumber: 9,
    description: "Aiming to restore local forests and plant more trees.",
    location: {
      type: "Point",
      coordinates: [-97.7431, 30.2672] // Austin, TX
    },
    creatorType: communityCreatorType.USER,
    creatorId: johnDoeId,
  },
  {
    id: new ObjectId().toHexString(),
    communityName: "Elderly Care Volunteers",
    communityNumber: 10,
    description: "Providing community support for elderly individuals.",
    location: {
      type: "Point",
      coordinates: [-117.1611, 32.7157] // San Diego, CA
    },
    creatorType: communityCreatorType.USER,
    creatorId: johnDoeId,
  }
];

// Store the generated project IDs in dataStore for later reference (if needed)
communities.forEach(community => {
  dataStore.projects.set(community.communityName, community.id);
  dataStore.community.set(community.communityName, community.id);
});
