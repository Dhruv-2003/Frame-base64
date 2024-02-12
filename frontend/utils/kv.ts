import { kv } from "@vercel/kv";

export const getCompetitorEntries = async () => {
  try {
    const userIds = [];
    const entries = [];

    // Scan all keys
    let cursor = 0;
    do {
      const result = await kv.scan(cursor);
      cursor = result[0];
      const keys = result[1];

      // Retrieve values for each key
      for (const key of keys) {
        const entry = await kv.get(key);
        if (entry !== null) {
          userIds.push(key);
          entries.push(entry);
        }
      }
    } while (cursor !== 0);
    console.log(userIds, entries);
    return { userIds, entries };
  } catch (error) {
    console.error("Error retrieving entries:", error);
    throw error;
  }
};
