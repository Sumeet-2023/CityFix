import { ObjectId } from 'bson';
import { dataStore } from './dataStore';

const frankJohnson = dataStore.users.get("frank_johnson");
const graceDavis = dataStore.users.get("grace_davis");
if (!frankJohnson || !graceDavis) {
  throw new Error("User not found in dataStore.");
}

export const clans = [
  {
    id: new ObjectId().toHexString(),
    clanName: "Guardians of the Earth",
    badge: null,
    description: "A clan dedicated to making the world more environmentally friendly.",
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128], // New York City, NY
      city: "New York City",
      state: "New York",
      country: "USA"
    },
    clanTag: "GOTHEARTH",
    creatorId: frankJohnson,
    requiredMembers: 50
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Community Heroes",
    badge: null,
    description: "A group focused on making their local community a better place.",
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522], // Los Angeles, CA
      city: "Los Angeles",
      state: "California",
      country: "USA"
    },
    clanTag: "COMMUNITYHEROES",
    creatorId: graceDavis,
    requiredMembers: 50
  }
];

// Store the generated Crowd IDs in dataStore for later reference
clans.forEach(clan => {
  dataStore.clans.set(clan.clanTag, clan.id);
});
