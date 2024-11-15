"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clans = void 0;
const bson_1 = require("bson");
const dataStore_1 = require("./dataStore");
const frankJohnson = dataStore_1.dataStore.users.get("frank_johnson");
const graceDavis = dataStore_1.dataStore.users.get("grace_davis");
if (!frankJohnson || !graceDavis) {
    throw new Error("User not found in dataStore.");
}
exports.clans = [
    {
        id: new bson_1.ObjectId().toHexString(),
        clanName: "Guardians of the Earth",
        badge: null,
        description: "A clan dedicated to making the world more environmentally friendly.",
        location: {
            type: "Point",
            coordinates: [-74.0060, 40.7128], // New York City, NY
            city: "New York City",
            state: "New York",
            country: "USA"
        },
        clanTag: "GOTHEARTH",
        creatorId: frankJohnson,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        clanName: "Community Heroes",
        badge: null,
        description: "A group focused on making their local community a better place.",
        location: {
            type: "Point",
            coordinates: [-118.2437, 34.0522], // Los Angeles, CA
            city: "Los Angeles",
            state: "California",
            country: "USA"
        },
        clanTag: "COMMUNITYHEROES",
        creatorId: graceDavis,
    }
];
// Store the generated Crowd IDs in dataStore for later reference
exports.clans.forEach(clan => {
    dataStore_1.dataStore.clans.set(clan.clanTag, clan.id);
});
