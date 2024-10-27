import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

// Assume that "john_doe" and "jane_smith" are joining "Beach Cleanup"
const johnDoeId = dataStore.users.get("john_doe");
const janeSmithId = dataStore.users.get("jane_smith");
const beachCleanupId = dataStore.projects.get("Beach Cleanup");

if (!johnDoeId || !janeSmithId || !beachCleanupId) {
  throw new Error("User or project not found in dataStore.");
}

export const userProjects = [
  {
    id: new ObjectId().toHexString(),
    userId: johnDoeId,
    projectId: beachCleanupId,
  },
  {
    id: new ObjectId().toHexString(),
    userId: janeSmithId,
    projectId: beachCleanupId,
  },
];

// Store the generated UserProject IDs in dataStore for later reference if needed
userProjects.forEach(userProject => {
  dataStore.userProjects.set(`${userProject.userId}_${userProject.projectId}`, userProject.id);
});
