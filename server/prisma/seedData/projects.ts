import { ObjectId } from 'bson';
import { dataStore } from './dataStore'; // Import the shared data store

// Assuming that "john_doe" is the user creating these projects
const johnDoeId = dataStore.users.get("john_doe");

if (!johnDoeId) {
  throw new Error("User 'john_doe' not found in dataStore.");
}

export const projects = [
  {
    id: new ObjectId().toHexString(), // Generate a new unique ID
    projectTag: "Cleanup",
    projectNumber: 1,
    projectName: "Beach Cleanup",
    createdById: johnDoeId, // Assign `createdById` using the stored ID
    projectDescription: "A community project to clean up the beach.",
    reportedDate: new Date(),
    reportedTime: new Date(),
    executionDate: new Date(),
    executionTime: new Date(),
    location: "Santa Monica Beach",
    lastUpdated: new Date(),
    volunteerNumber: 10,
    contactInfo: {
      email: "contact@beachcleanup.com",
      number: 1234567890,
    },
  },
];

// Store the generated project IDs in dataStore for later reference
projects.forEach(project => {
  dataStore.projects.set(project.projectName, project.id);
});