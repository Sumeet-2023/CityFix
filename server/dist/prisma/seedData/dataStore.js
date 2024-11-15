"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataStore = void 0;
exports.dataStore = {
    users: new Map(), // A Map to store user IDs
    projects: new Map(), // A Map to store project IDs
    ngos: new Map(), // A Map to store NGO IDs
    clans: new Map(), // A Map to store clan IDs
    userProjects: new Map(), // A Map to store user-project relations
    issues: new Map(), // A Map to store issue IDs
    community: new Map(), // A Map to store community ID
    userClan: new Map(),
    fundings: new Map()
};
