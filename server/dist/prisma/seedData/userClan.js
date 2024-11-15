"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userClans = void 0;
const bson_1 = require("bson");
const dataStore_1 = require("./dataStore");
const johnDoeId = dataStore_1.dataStore.users.get("john_doe");
const janeSmithId = dataStore_1.dataStore.users.get("jane_smith");
const bobBrown = dataStore_1.dataStore.users.get("bob_brown");
const carolWhite = dataStore_1.dataStore.users.get("carol_white");
const davidGreen = dataStore_1.dataStore.users.get("david_green");
const forestClanId = dataStore_1.dataStore.clans.get("GOTHEARTH");
if (!johnDoeId || !janeSmithId || !bobBrown || !carolWhite || !davidGreen || !forestClanId) {
    throw new Error("User or Clan not found in dataStore.");
}
exports.userClans = [
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: johnDoeId,
        clanId: forestClanId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: janeSmithId,
        clanId: forestClanId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: carolWhite,
        clanId: forestClanId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: davidGreen,
        clanId: forestClanId,
    },
    {
        id: new bson_1.ObjectId().toHexString(),
        userId: bobBrown,
        clanId: forestClanId,
    },
];
exports.userClans.forEach(userClan => {
    dataStore_1.dataStore.userClan.set(userClan.userId, userClan.clanId);
});
