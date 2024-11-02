import { ObjectId } from 'bson';
import { dataStore } from './dataStore';
import { Status } from '@prisma/client';

// Assuming user IDs for reporting users
const johnDoeId = dataStore.users.get("john_doe");
const janeSmithId = dataStore.users.get("jane_smith");

// Example community ID; adjust this based on your dataStore
const communityId = dataStore.community.get("Beach Cleaners United");

if (!johnDoeId || !janeSmithId || !communityId) {
  throw new Error("User or Community not found in dataStore.");
}

export const issues = [
  {
    id: new ObjectId().toHexString(),
    issueTag: "Pothole",
    issueNumber: 1,
    issueName: "Pothole on Main Street",
    userId: johnDoeId,
    issueDescription: "A large pothole has formed near Main Street. It is causing issues for vehicles.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128], // Main Street, NY
      city: "New York City",
      state: "New York",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Garbage",
    issueNumber: 2,
    issueName: "Overflowing Trash Bin at Park",
    userId: janeSmithId,
    issueDescription: "The trash bin at the central park is overflowing. Needs immediate attention.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522], // Central Park, LA
      city: "Los Angeles",
      state: "California",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Streetlight",
    issueNumber: 3,
    issueName: "Broken Streetlight on 5th Ave",
    userId: johnDoeId,
    issueDescription: "Streetlight on 5th Ave is broken, causing dark spots at night.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781], // 5th Ave, Chicago, IL
      city: "Chicago",
      state: "Illinois",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Graffiti",
    issueNumber: 4,
    issueName: "Graffiti on City Hall",
    userId: janeSmithId,
    issueDescription: "Graffiti found on the walls of City Hall. Needs cleaning.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-95.3698, 29.7604], // City Hall, Houston, TX
      city: "Houston",
      state: "Texas",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Road Damage",
    issueNumber: 5,
    issueName: "Cracks on Elm Street",
    userId: johnDoeId,
    issueDescription: "Deep cracks along Elm Street are making driving difficult.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-112.074, 33.4484], // Elm Street, Phoenix, AZ
      city: "Phoenix",
      state: "Arizona",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Park Bench",
    issueNumber: 6,
    issueName: "Broken Bench in Riverside Park",
    userId: janeSmithId,
    issueDescription: "A broken park bench in Riverside Park is unsafe for use.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-75.1652, 39.9526], // Riverside Park, Philadelphia, PA
      city: "Philadelphia",
      state: "Pennsylvania",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Flooding",
    issueNumber: 7,
    issueName: "Flooding on Maple Ave",
    userId: johnDoeId,
    issueDescription: "Frequent flooding on Maple Ave during rainstorms.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-98.4936, 29.4241], // Maple Ave, San Antonio, TX
      city: "San Antonio",
      state: "Texas",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Playground Equipment",
    issueNumber: 8,
    issueName: "Unsafe Playground Equipment",
    userId: janeSmithId,
    issueDescription: "The swing set in the local playground is broken and unsafe.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-122.3321, 47.6062], // Local Playground, Seattle, WA
      city: "Seattle",
      state: "Washington",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Traffic Light",
    issueNumber: 9,
    issueName: "Faulty Traffic Light on Main and 2nd",
    userId: johnDoeId,
    issueDescription: "Traffic light is stuck on red, causing a backup of vehicles.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-104.9903, 39.7392], // Main and 2nd, Denver, CO
      city: "Denver",
      state: "Colorado",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Sidewalk",
    issueNumber: 10,
    issueName: "Cracked Sidewalk on 3rd St",
    userId: janeSmithId,
    issueDescription: "The sidewalk on 3rd St is heavily cracked and unsafe for pedestrians.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-80.1918, 25.7617], // 3rd St, Miami, FL
      city: "Miami",
      state: "Florida",
      country: "USA"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Pothole",
    issueNumber: 11,
    issueName: "Pothole near Maxus Mall",
    userId: janeSmithId,
    issueDescription: "Large pothole near Maxus Mall entrance, affecting traffic flow.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [72.8537, 19.3002], // Maxus Mall, Mira Bhayandar
      city: "Mira Bhayandar",
      state: "Maharashtra",
      country: "India"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Garbage",
    issueNumber: 12,
    issueName: "Overflowing Trash Bin near Mira Road Station",
    userId: johnDoeId,
    issueDescription: "Overflowing trash bin near Mira Road railway station, causing foul smell.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [72.8540, 19.2813], // Mira Road Station, Mira Bhayandar
      city: "Mira Bhayandar",
      state: "Maharashtra",
      country: "India"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
  {
    id: new ObjectId().toHexString(),
    issueTag: "Streetlight",
    issueNumber: 13,
    issueName: "Broken Streetlight near Silver Park",
    userId: janeSmithId,
    issueDescription: "Streetlight malfunction near Silver Park, making the area dark.",
    reportedDate: new Date(),
    location: {
      type: "Point",
      coordinates: [72.8389, 19.3081], // Silver Park, Mira Bhayandar
      city: "Mira Bhayandar",
      state: "Maharashtra",
      country: "India"
    },
    lastUpdated: new Date(),
    authorityNeeds : "Need",
    status: Status.OPEN
  },
];


// Store the generated issue IDs in dataStore for later reference (if needed)
issues.forEach(issue => {
  dataStore.issues.set(issue.issueName, issue.id);
});
