export const dataStore = {
    users: new Map<string, string>(), // A Map to store user IDs
    projects: new Map<string, string>(), // A Map to store project IDs
    ngos: new Map<string, string>(), // A Map to store NGO IDs
    clans: new Map<string, string>(), // A Map to store clan IDs
    userProjects: new Map<string, string>(), // A Map to store user-project relations
    issues: new Map<string, string>(), // A Map to store issue IDs
    community: new Map<string, string>(), // A Map to store community ID
    userClan: new Map<string, string>(),
    fundings: new Map<string, string | null>()
  };
  