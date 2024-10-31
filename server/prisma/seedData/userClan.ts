import { ObjectId } from 'bson';
import { dataStore } from './dataStore';

const johnDoeId = dataStore.users.get("john_doe");
const janeSmithId = dataStore.users.get("jane_smith");
const bobBrown = dataStore.users.get("bob_brown");
const carolWhite = dataStore.users.get("carol_white");
const davidGreen = dataStore.users.get("david_green");

const forestClanId = dataStore.clans.get("GOTHEARTH");

if (!johnDoeId || !janeSmithId || !bobBrown || !carolWhite || !davidGreen || !forestClanId) {
  throw new Error("User or Clan not found in dataStore.");
}

export const userClans = [
    {
        id: new ObjectId().toHexString(),
        userId: johnDoeId,
        clanId: forestClanId,
    },
    {
        id: new ObjectId().toHexString(),
        userId: janeSmithId,
        clanId: forestClanId,
    },
    {
        id: new ObjectId().toHexString(),
        userId: carolWhite,
        clanId: forestClanId,
    },
    {
        id: new ObjectId().toHexString(),
        userId: davidGreen,
        clanId: forestClanId,
    },
    {
        id: new ObjectId().toHexString(),
        userId: bobBrown,
        clanId: forestClanId,
    },
]

userClans.forEach(userClan => {
    dataStore.userClan.set(userClan.userId, userClan.clanId);
});