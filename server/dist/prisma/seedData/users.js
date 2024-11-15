"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const bson_1 = require("bson");
const dataStore_1 = require("./dataStore");
exports.users = [
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "john_doe",
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        location: {
            type: "Point",
            coordinates: [-74.0060, 40.7128], // New York City
            city: "New York City",
            state: "New York",
            country: "USA"
        },
        followerCount: 100,
        followingCount: 150,
        points: 200,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "jane_smith",
        firstname: "Jane",
        lastname: "Smith",
        email: "jane.smith@example.com",
        location: {
            type: "Point",
            coordinates: [-118.2437, 34.0522], // Los Angeles
            city: "Los Angeles",
            state: "California",
            country: "USA"
        },
        followerCount: 50,
        followingCount: 75,
        points: 120,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "alice_jones",
        firstname: "Alice",
        lastname: "Jones",
        email: "alice.jones@example.com",
        location: {
            type: "Point",
            coordinates: [-87.6298, 41.8781], // Chicago
            city: "Chicago",
            state: "Illinois",
            country: "USA"
        },
        followerCount: 200,
        followingCount: 180,
        points: 300,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "bob_brown",
        firstname: "Bob",
        lastname: "Brown",
        email: "bob.brown@example.com",
        location: {
            type: "Point",
            coordinates: [-95.3698, 29.7604], // Houston
            city: "Houston",
            state: "Texas",
            country: "USA"
        },
        followerCount: 80,
        followingCount: 90,
        points: 140,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "carol_white",
        firstname: "Carol",
        lastname: "White",
        email: "carol.white@example.com",
        location: {
            type: "Point",
            coordinates: [-112.074, 33.4484], // Phoenix
            city: "Phoenix",
            state: "Arizona",
            country: "USA"
        },
        followerCount: 60,
        followingCount: 70,
        points: 110,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "david_green",
        firstname: "David",
        lastname: "Green",
        email: "david.green@example.com",
        location: {
            type: "Point",
            coordinates: [-75.1652, 39.9526], // Philadelphia
            city: "Philadelphia",
            state: "Pennsylvania",
            country: "USA"
        },
        followerCount: 95,
        followingCount: 110,
        points: 130,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "emily_young",
        firstname: "Emily",
        lastname: "Young",
        email: "emily.young@example.com",
        location: {
            type: "Point",
            coordinates: [-98.4936, 29.4241], // San Antonio
            city: "San Antonio",
            state: "Texas",
            country: "USA"
        },
        followerCount: 150,
        followingCount: 140,
        points: 210,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "frank_johnson",
        firstname: "Frank",
        lastname: "Johnson",
        email: "frank.johnson@example.com",
        location: {
            type: "Point",
            coordinates: [-122.3321, 47.6062], // Seattle
            city: "Seattle",
            state: "Washington",
            country: "USA"
        },
        followerCount: 120,
        followingCount: 130,
        points: 180,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "grace_davis",
        firstname: "Grace",
        lastname: "Davis",
        email: "grace.davis@example.com",
        location: {
            type: "Point",
            coordinates: [-104.9903, 39.7392], // Denver
            city: "Denver",
            state: "Colorado",
            country: "USA"
        },
        followerCount: 90,
        followingCount: 100,
        points: 150,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        username: "henry_wilson",
        firstname: "Henry",
        lastname: "Wilson",
        email: "henry.wilson@example.com",
        location: {
            type: "Point",
            coordinates: [-80.1918, 25.7617], // Miami
            city: "Miami",
            state: "Florida",
            country: "USA"
        },
        followerCount: 140,
        followingCount: 160,
        points: 190,
    }
];
// Update data store as needed
exports.users.forEach(user => {
    dataStore_1.dataStore.users.set(user.username, user.id);
});
