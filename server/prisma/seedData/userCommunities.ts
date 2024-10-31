import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

// Assume that "john_doe" and "jane_smith" are joining "Beach Cleanup"
const johnDoeId = dataStore.users.get("john_doe");
const janeSmithId = dataStore.users.get("jane_smith");
const communityId = dataStore.community.get("Beach Cleaners United");

if (!johnDoeId || !janeSmithId || !communityId) {
  throw new Error("User or community not found in dataStore.");
}

export const userCommunities = [
  {
    id: new ObjectId().toHexString(),
    userId: johnDoeId,
    communityId: communityId,
  },
  {
    id: new ObjectId().toHexString(),
    userId: janeSmithId,
    communityId: communityId,
  },
];

// Store the generated UserProject IDs in dataStore for later reference if needed
userCommunities.forEach(userCommunity => {
  dataStore.userProjects.set(userCommunity.userId, userCommunity.communityId);
});
