"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communities = void 0;
const bson_1 = require("bson");
const dataStore_1 = require("./dataStore");
const client_1 = require("@prisma/client");
// Assuming "john_doe" is the user creating these projects
const johnDoeId = dataStore_1.dataStore.users.get("john_doe");
const ngoId = dataStore_1.dataStore.ngos.get("Green Earth Initiative");
if (!johnDoeId) {
    throw new Error("User 'john_doe' not found in dataStore.");
}
exports.communities = [
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Beach Cleaners United",
        communityNumber: 1,
        description: "A community focused on keeping beaches clean and litter-free.",
        location: {
            type: "Point",
            coordinates: [-118.4965, 34.0194], // Santa Monica Beach, CA
            city: "Santa Monica",
            state: "California",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Urban Green Team",
        communityNumber: 2,
        description: "Planting trees and creating green spaces in urban areas.",
        location: {
            type: "Point",
            coordinates: [-73.935242, 40.73061], // New York City, NY
            city: "New York City",
            state: "New York",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Recyclers of Chicago",
        communityNumber: 3,
        description: "A recycling initiative focused on increasing recycling rates.",
        location: {
            type: "Point",
            coordinates: [-87.6298, 41.8781], // Chicago, IL
            city: "Chicago",
            state: "Illinois",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Houston Water Savers",
        communityNumber: 4,
        description: "Promoting water conservation practices within Houston.",
        location: {
            type: "Point",
            coordinates: [-95.3698, 29.7604], // Houston, TX
            city: "Houston",
            state: "Texas",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Safe Roads Initiative",
        communityNumber: 5,
        description: "Organizing road safety workshops and awareness campaigns.",
        location: {
            type: "Point",
            coordinates: [-80.1918, 25.7617], // Miami, FL
            city: "Miami",
            state: "Florida",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Community Gardeners SF",
        communityNumber: 6,
        description: "Creating and maintaining a community garden in San Francisco.",
        location: {
            type: "Point",
            coordinates: [-122.4194, 37.7749], // San Francisco, CA
            city: "San Francisco",
            state: "California",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.NGO,
        ngoId: ngoId
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Denver Wildlife Advocates",
        communityNumber: 7,
        description: "Raising awareness about wildlife protection in Denver.",
        location: {
            type: "Point",
            coordinates: [-104.9903, 39.7392], // Denver, CO
            city: "Denver",
            state: "Colorado",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.NGO,
        ngoId: ngoId
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Solar Power Pioneers",
        communityNumber: 8,
        description: "Encouraging the adoption of solar energy within the community.",
        location: {
            type: "Point",
            coordinates: [-118.2437, 34.0522], // Los Angeles, CA
            city: "Los Angeles",
            state: "California",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Austin Reforestation Project",
        communityNumber: 9,
        description: "Aiming to restore local forests and plant more trees.",
        location: {
            type: "Point",
            coordinates: [-97.7431, 30.2672], // Austin, TX
            city: "Austin",
            state: "Texas",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Elderly Care Volunteers",
        communityNumber: 10,
        description: "Providing community support for elderly individuals.",
        location: {
            type: "Point",
            coordinates: [-117.1611, 32.7157], // San Diego, CA
            city: "San Diego",
            state: "California",
            country: "USA"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "Beach Cleaner",
        communityNumber: 13,
        description: "focused on keeping beaches clean and litter-free.",
        location: {
            type: "Point",
            coordinates: [9.2100, 49.1400], // Heilbronn, Germany (random)
            city: "Heilbronn",
            state: "Baden-Württemberg",
            country: "Germany"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        communityName: "United",
        communityNumber: 6,
        description: "clean and litter-free.",
        location: {
            type: "Point",
            coordinates: [9.2072, 49.1359], // Heilbronn, Germany (random)
            city: "Heilbronn",
            state: "Baden-Württemberg",
            country: "Germany"
        },
        creatorType: client_1.communityCreatorType.USER,
        creatorId: johnDoeId
    }
];
// Store the generated project IDs in dataStore for later reference (if needed)
exports.communities.forEach(community => {
    dataStore_1.dataStore.projects.set(community.communityName, community.id);
    dataStore_1.dataStore.community.set(community.communityName, community.id);
});
