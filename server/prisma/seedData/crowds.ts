import { ObjectId } from 'bson';
import { dataStore } from './dataStore';

export const crowds = [
  {
    id: new ObjectId().toHexString(),
    clanName: "Guardians of the Earth",
    badge: null,
    description: "A clan dedicated to making the world more environmentally friendly.",
    clanType: "Public",
    peopleJoinedNumber: 50,
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128]
    },
    clanTag: "GOTHEARTH",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Community Heroes",
    badge: null,
    description: "A group focused on making their local community a better place.",
    clanType: "Private",
    peopleJoinedNumber: 20,
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522]
    },
    clanTag: "COMMUNITYHEROES",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Urban Guardians",
    badge: null,
    description: "Defenders of city environments, promoting urban sustainability.",
    clanType: "Public",
    peopleJoinedNumber: 35,
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781]
    },
    clanTag: "URBANGUARD",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Nature Protectors",
    badge: null,
    description: "A clan dedicated to conserving natural resources and habitats.",
    clanType: "Public",
    peopleJoinedNumber: 45,
    location: {
      type: "Point",
      coordinates: [-95.3698, 29.7604]
    },
    clanTag: "NATUREPROTECT",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Eco Warriors",
    badge: null,
    description: "A group of environmental enthusiasts fighting climate change.",
    clanType: "Private",
    peopleJoinedNumber: 25,
    location: {
      type: "Point",
      coordinates: [-122.3321, 47.6062]
    },
    clanTag: "ECOWARRIORS",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Sustainable Cities",
    badge: null,
    description: "A group aimed at developing eco-friendly urban spaces.",
    clanType: "Public",
    peopleJoinedNumber: 40,
    location: {
      type: "Point",
      coordinates: [-104.9903, 39.7392]
    },
    clanTag: "SUSTAINCITY",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Climate Action Network",
    badge: null,
    description: "Global activists promoting climate-conscious efforts.",
    clanType: "Public",
    peopleJoinedNumber: 60,
    location: {
      type: "Point",
      coordinates: [-80.1918, 25.7617]
    },
    clanTag: "CLIMATEACTION",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Green Innovators",
    badge: null,
    description: "Inventors and entrepreneurs focused on green tech.",
    clanType: "Private",
    peopleJoinedNumber: 15,
    location: {
      type: "Point",
      coordinates: [-112.074, 33.4484]
    },
    clanTag: "GREENINNOV",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Environmental Pioneers",
    badge: null,
    description: "Pioneering new solutions for a greener planet.",
    clanType: "Public",
    peopleJoinedNumber: 30,
    location: {
      type: "Point",
      coordinates: [-75.1652, 39.9526]
    },
    clanTag: "ENVIRONPIONEER",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Earth Stewards",
    badge: null,
    description: "Individuals who promote conservation and sustainable practices.",
    clanType: "Public",
    peopleJoinedNumber: 55,
    location: {
      type: "Point",
      coordinates: [-98.4936, 29.4241]
    },
    clanTag: "EARTHSTEWARD",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Bhayandar Eco Warriors",
    badge: null,
    description: "Local activists working to keep Bhayandar clean and green.",
    clanType: "Public",
    peopleJoinedNumber: 35,
    location: {
      type: "Point",
      coordinates: [72.8544, 19.3016] // Coordinates for Bhayandar
    },
    clanTag: "BHAYECO",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Mira Environmentalists",
    badge: null,
    description: "Environmental advocates focusing on sustainable practices in Mira Road.",
    clanType: "Private",
    peopleJoinedNumber: 20,
    location: {
      type: "Point",
      coordinates: [72.8567, 19.2813] // Coordinates for Mira Road
    },
    clanTag: "MIRAENV",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Coastal Guardians",
    badge: null,
    description: "Protectors of the coastal ecosystem in Uttan.",
    clanType: "Public",
    peopleJoinedNumber: 40,
    location: {
      type: "Point",
      coordinates: [72.7894, 19.3233] // Coordinates for Uttan
    },
    clanTag: "COASTGUARD",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Waste Watchers",
    badge: null,
    description: "A community dedicated to reducing waste in Bhayandar West.",
    clanType: "Public",
    peopleJoinedNumber: 50,
    location: {
      type: "Point",
      coordinates: [72.8381, 19.2936] // Coordinates for Bhayandar West
    },
    clanTag: "WASTEWATCH",
  },
  {
    id: new ObjectId().toHexString(),
    clanName: "Mira Bhayandar Green Alliance",
    badge: null,
    description: "Collaborative efforts for greener surroundings in Mira Bhayandar.",
    clanType: "Public",
    peopleJoinedNumber: 60,
    location: {
      type: "Point",
      coordinates: [72.8577, 19.2845] // General coordinates for Mira Bhayandar
    },
    clanTag: "MBGREEN",
  },
];

// Store the generated Crowd IDs in dataStore for later reference
crowds.forEach(crowd => {
  dataStore.crowds.set(crowd.clanTag, crowd.id);
});
