"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProjects = void 0;
const bson_1 = require("bson");
const dataStore_1 = require("./dataStore"); // Import the shared data store
// Assume that "john_doe" and "jane_smith" are joining "Beach Cleanup"
const johnDoeId = dataStore_1.dataStore.users.get("john_doe");
const janeSmithId = dataStore_1.dataStore.users.get("jane_smith");
const beachCleanupId = dataStore_1.dataStore.projects.get("Beach Restoration Project");
if (!johnDoeId || !janeSmithId) {
    throw new Error("User or project not found in dataStore.");
}
if (!beachCleanupId) {
    throw new Error("Project not found");
}
exports.userProjects = [
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: johnDoeId,
        projectId: beachCleanupId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: janeSmithId,
        projectId: beachCleanupId,
    },
];
// Store the generated UserProject IDs in dataStore for later reference if needed
exports.userProjects.forEach(userProject => {
    dataStore_1.dataStore.userProjects.set(userProject.userId, userProject.projectId);
});
