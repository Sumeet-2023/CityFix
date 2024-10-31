import { ObjectId } from 'bson';
import { dataStore } from './dataStore';

const frankJohnson = dataStore.users.get("frank_johnson");
const graceDavis = dataStore.users.get("grace_davis");
if (!frankJohnson || !graceDavis){
  throw new Error("User not found in dataStore.");
}

export const clans = [
  {
    id: new ObjectId().toHexString(),
    clanName: "Guardians of the Earth",
    badge: null,
    description: "A clan dedicated to making the world more environmentally friendly.",
    location: { type: "Point", coordinates: [-74.0060, 40.7128] },
    clanTag: "GOTHEARTH",
    creatorId: frankJohnson,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Community Heroes",
    badge: null,
    description: "A group focused on making their local community a better place.",
    location: { type: "Point", coordinates: [-118.2437, 34.0522] },
    clanTag: "COMMUNITYHEROES",
    creatorId: graceDavis,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Urban Guardians",
    badge: null,
    description: "Defenders of city environments, promoting urban sustainability.",
    location: { type: "Point", coordinates: [-87.6298, 41.8781] },
    clanTag: "URBANGUARD",
    creatorId: frankJohnson,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Nature Protectors",
    badge: null,
    description: "A clan dedicated to conserving natural resources and habitats.",
    location: { type: "Point", coordinates: [-95.3698, 29.7604] },
    clanTag: "NATUREPROTECT",
    creatorId: graceDavis,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Eco Warriors",
    badge: null,
    description: "A group of environmental enthusiasts fighting climate change.",
    location: { type: "Point", coordinates: [-122.3321, 47.6062] },
    clanTag: "ECOWARRIORS",
    creatorId: frankJohnson,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Sustainable Cities",
    badge: null,
    description: "A group aimed at developing eco-friendly urban spaces.",
    location: { type: "Point", coordinates: [-104.9903, 39.7392] },
    clanTag: "SUSTAINCITY",
    creatorId: frankJohnson,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Climate Action Network",
    badge: null,
    description: "Global activists promoting climate-conscious efforts.",
    location: { type: "Point", coordinates: [-80.1918, 25.7617] },
    clanTag: "CLIMATEACTION",
    creatorId: graceDavis,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Green Innovators",
    badge: null,
    description: "Inventors and entrepreneurs focused on green tech.",
    location: { type: "Point", coordinates: [-112.074, 33.4484] },
    clanTag: "GREENINNOV",
    creatorId: graceDavis,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Environmental Pioneers",
    badge: null,
    description: "Pioneering new solutions for a greener planet.",
    location: { type: "Point", coordinates: [-75.1652, 39.9526] },
    clanTag: "ENVIRONPIONEER",
    creatorId: graceDavis,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Earth Stewards",
    badge: null,
    description: "Individuals who promote conservation and sustainable practices.",
    location: { type: "Point", coordinates: [-98.4936, 29.4241] },
    clanTag: "EARTHSTEWARD",
    creatorId: frankJohnson,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Bhayandar Eco Warriors",
    badge: null,
    description: "Local activists working to keep Bhayandar clean and green.",
    location: { type: "Point", coordinates: [72.8544, 19.3016] },
    clanTag: "BHAYECO",
    creatorId: graceDavis,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Mira Environmentalists",
    badge: null,
    description: "Environmental advocates focusing on sustainable practices in Mira Road.",
    location: { type: "Point", coordinates: [72.8567, 19.2813] },
    clanTag: "MIRAENV",
    creatorId: graceDavis,
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Coastal Guardians",
    badge: null,
    description: "Protectors of the coastal ecosystem in Uttan.",
    location: { type: "Point", coordinates: [72.7894, 19.3233] },
    clanTag: "COASTGUARD",
    creatorId: frankJohnson,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Waste Watchers",
    badge: null,
    description: "A community dedicated to reducing waste in Bhayandar West.",
    location: { type: "Point", coordinates: [72.8381, 19.2936] },
    clanTag: "WASTEWATCH",
    creatorId: frankJohnson,
    
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Mira Bhayandar Green Alliance",
    badge: null,
    description: "Collaborative efforts for greener surroundings in Mira Bhayandar.",
    location: { type: "Point", coordinates: [72.8577, 19.2845] },
    clanTag: "MBGREEN",
    creatorId: graceDavis,
    
  }
];
// Store the generated Crowd IDs in dataStore for later reference
clans.forEach(clan => {
  dataStore.clans.set(clan.clanTag, clan.id);
});
