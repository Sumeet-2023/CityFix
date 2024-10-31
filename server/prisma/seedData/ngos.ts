import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

export const ngos = [
  {
    id: new ObjectId().toHexString(), // Generate a unique ID without hyphens
    ngoName: "Green Earth Initiative",
    description: "An NGO focused on reducing pollution and promoting sustainability.",
    contact: {
      email: "contact@greenearth.org",
      number: "1234567890",
    },
    raisedAmount: 50000,
    authorized: true,
    createdAt: new Date(),
    creatorId: dataStore.users.get("john_doe"),
  },
  {
    id: new ObjectId().toHexString(),
    ngoName: "Animal Welfare Society",
    description: "A non-profit organization working to protect animal rights and welfare.",
    contact: {
      email: "info@animalwelfare.org",
      number: "9876543210",
    },
    raisedAmount: 75000,
    authorized: true,
    createdAt: new Date(),
    creatorId: dataStore.users.get("jane_smith"),
  },
];

// Store the generated NGO IDs in dataStore for later reference
ngos.forEach((ngo) => {
  dataStore.ngos.set(ngo.ngoName, ngo.id);
});
