import { ObjectId } from 'bson';
import { dataStore } from './dataStore';

export const users = [
  {
    id: new ObjectId().toHexString(),
    username: "john_doe",
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128]
    },
    followerCount: 100,
    followingCount: 150,
    points: 200,
    
  },
  {
    id: new ObjectId().toHexString(),
    username: "jane_smith",
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522]
    },
    followerCount: 50,
    followingCount: 75,
    points: 120,
    
  },
  {
    id: new ObjectId().toHexString(),
    username: "alice_jones",
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781]
    },
    followerCount: 200,
    followingCount: 180,
    points: 300,
    
  },
  {
    id: new ObjectId().toHexString(),
    username: "bob_brown",
    location: {
      type: "Point",
      coordinates: [-95.3698, 29.7604]
    },
    followerCount: 80,
    followingCount: 90,
    points: 140,
  },
  {
    id: new ObjectId().toHexString(),
    username: "carol_white",
    location: {
      type: "Point",
      coordinates: [-112.074, 33.4484]
    },
    followerCount: 60,
    followingCount: 70,
    points: 110,
    
  },
  {
    id: new ObjectId().toHexString(),
    username: "david_green",
    location: {
      type: "Point",
      coordinates: [-75.1652, 39.9526]
    },
    followerCount: 95,
    followingCount: 110,
    points: 130,
    
  },
  {
    id: new ObjectId().toHexString(),
    username: "emily_young",
    location: {
      type: "Point",
      coordinates: [-98.4936, 29.4241]
    },
    followerCount: 150,
    followingCount: 140,
    points: 210,
    
  },
  {
    id: new ObjectId().toHexString(),
    username: "frank_johnson",
    location: {
      type: "Point",
      coordinates: [-122.3321, 47.6062]
    },
    followerCount: 120,
    followingCount: 130,
    points: 180,
    
  },
  {
    id: new ObjectId().toHexString(),
    username: "grace_davis",
    location: {
      type: "Point",
      coordinates: [-104.9903, 39.7392]
    },
    followerCount: 90,
    followingCount: 100,
    points: 150,
    
  },
  {
    id: new ObjectId().toHexString(),
    username: "henry_wilson",
    location: {
      type: "Point",
      coordinates: [-80.1918, 25.7617]
    },
    followerCount: 140,
    followingCount: 160,
    points: 190,
    
  }
];


users.forEach(user => {
  dataStore.users.set(user.username, user.id);
});