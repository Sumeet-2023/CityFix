import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

export const ngos = [
  {
    id: new ObjectId().toHexString(), // Generate a unique ID without hyphens
    ngoName: "Green Earth Initiative",
    ngoType: "Environment",
    ngoPhotoUrl: null,
    ngoDescription: "An NGO focused on reducing pollution and promoting sustainability.",
    contact: {
      email: "contact@greenearth.org",
      number: 1234567890,
    },
    raisedMoney: 50000,
  },
  {
    id: new ObjectId().toHexString(),
    ngoName: "Animal Welfare Society",
    ngoType: "Animal Rights",
    ngoPhotoUrl: null,
    ngoDescription: "A non-profit organization working to protect animal rights and welfare.",
    contact: {
      email: "info@animalwelfare.org",
      number: 9876543210,
    },
    raisedMoney: 75000,
  },
];

// Store the generated NGO IDs in dataStore for later reference
ngos.forEach(ngo => {
  dataStore.ngos.set(ngo.ngoName, ngo.id);
});