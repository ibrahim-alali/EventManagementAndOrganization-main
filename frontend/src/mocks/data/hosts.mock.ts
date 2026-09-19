import type { Host } from "../../api/hosts";
import { randomBool } from "../helpers/random.helpers";

// Mock hosts
export const allHosts: Host[] = Array.from({ length: 50 }).map((_, i) => {
  const upvoted = randomBool();
  const downvoted = upvoted ? false : randomBool();
  const vote_id = upvoted || downvoted ? crypto.randomUUID() : undefined;
  
  return {
    id: i + 1,
    full_name: `Host ${i + 1}`,
    email: `host${i + 1}@example.com`,
    role: i % 2 == 0 ? "organizer" : "provider",
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    vote_id,
    votes_score: Math.floor(Math.random() * 100),
    votes_count: Math.floor(Math.random() * 50),
    upvoted,
    downvoted,
  };
});
