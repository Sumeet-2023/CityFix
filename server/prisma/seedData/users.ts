import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

const forestClanId = dataStore.crowds.get("GOTHEARTH");
if (!forestClanId) {
    throw new Error("Clan not found in dataStore.");
  }
  

export const users = [
  {
    id: new ObjectId().toHexString(), // Generate a unique ID without hyphens
    username: "john_doe",
    location: "New York",
    followerCount: 100,
    followingCount: 150,
    points: 200,
    paid: true,
    joinedClanId: forestClanId,
  },
  {
    id: new ObjectId().toHexString(),
    username: "jane_smith",
    location: "Los Angeles",
    followerCount: 50,
    followingCount: 75,
    points: 120,
    paid: false,
    joinedClanId: forestClanId,
  },
];

// Store the generated user IDs in dataStore for later reference
users.forEach(user => {
  dataStore.users.set(user.username, user.id);
});