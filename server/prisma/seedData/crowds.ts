import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

export const crowds = [
  {
    id: new ObjectId().toHexString(), // Generate a unique ID without hyphens
    clanName: "Guardians of the Earth",
    badge: null,
    description: "A clan dedicated to making the world more environmentally friendly.",
    clanType: "Public",
    peopleJoinedNumber: 50,
    location: "Global",
    clanTag: "GOTHEARTH",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Community Heroes",
    badge: null,
    description: "A group focused on making their local community a better place.",
    clanType: "Private",
    peopleJoinedNumber: 20,
    location: "New York",
    clanTag: "COMMUNITYHEROES",
  },
];

// Store the generated Crowd IDs in dataStore for later reference
crowds.forEach(crowd => {
  dataStore.crowds.set(crowd.clanTag, crowd.id);
});
