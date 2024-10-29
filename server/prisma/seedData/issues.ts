import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

// Assuming "john_doe" and "jane_smith" are the users reporting the issues
const johnDoeId = dataStore.users.get("john_doe");
const janeSmithId = dataStore.users.get("jane_smith");

if (!johnDoeId || !janeSmithId) {
  throw new Error("User not found in dataStore.");
}

export const issues = [
  {
    id: new ObjectId().toHexString(), // Generate a unique ID without hyphens
    issueTag: "Pothole",
    issueNumber: 1,
    issueName: "Pothole on Main Street",
    userId: johnDoeId, // Assign `userId` using the stored ID
    issueDescription: "A large pothole has formed near Main Street. It is causing issues for vehicles.",
    issuePhoto: null,
    reportedDate: new Date(),
    location: "Main Street, NY",
    lastUpdated: new Date(),
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Garbage",
    issueNumber: 2,
    issueName: "Overflowing Trash Bin at Park",
    userId: janeSmithId, // Assign `userId` using the stored ID
    issueDescription: "The trash bin at the central park is overflowing. Needs immediate attention.",
    issuePhoto: null,
    reportedDate: new Date(),
    location: "Central Park, LA",
    lastUpdated: new Date(),
  },
];

// Store the generated issue IDs in dataStore for later reference (if needed)
issues.forEach(issue => {
  dataStore.issues.set(issue.issueName, issue.id);
});