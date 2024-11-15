"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCommunities = void 0;
const bson_1 = require("bson");
const dataStore_1 = require("./dataStore"); // Import the shared data store
// Assume that "john_doe" and "jane_smith" are joining "Beach Cleanup"
const johnDoeId = dataStore_1.dataStore.users.get("john_doe");
const janeSmithId = dataStore_1.dataStore.users.get("jane_smith");
const communityId = dataStore_1.dataStore.community.get("Beach Cleaners United");
if (!johnDoeId || !janeSmithId || !communityId) {
    throw new Error("User or community not found in dataStore.");
}
exports.userCommunities = [
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: johnDoeId,
        communityId: communityId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: janeSmithId,
        communityId: communityId,
    },
];
// Store the generated UserProject IDs in dataStore for later reference if needed
exports.userCommunities.forEach(userCommunity => {
    dataStore_1.dataStore.userProjects.set(userCommunity.userId, userCommunity.communityId);
});
