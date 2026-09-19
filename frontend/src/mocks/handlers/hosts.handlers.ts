import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { allHosts } from "../data/hosts.mock";
import { filterHosts } from "../helpers/hosts.filters.ts";

export const hostsHandlers = [
  // Organizers Handler
  http.get(`${ENV.API_BASE_URL}/auth/organizers`, async ({ request }) => {
    const data = filterHosts(allHosts, request, "organizer");
    return HttpResponse.json(data);
  }),

  // Providers Handler
  http.get(`${ENV.API_BASE_URL}/auth/providers`, async ({ request }) => {
    const data = filterHosts(allHosts, request, "provider");
    return HttpResponse.json(data);
  }),

  // Votes Handler
  http.post(`${ENV.API_BASE_URL}/general/votes`, async ({ request }) => {
    const body = (await request.json()) as {
      target_user: number;
      value: 1 | -1;
    };

    const host = allHosts.find((h) => h.id === body.target_user);

    if (!host) {
      return HttpResponse.json({ message: "Host not found" }, { status: 404 });
    }

    // update mock stats
    host.votes_score += body.value;
    host.votes_count += 1;
    host.vote_id = crypto.randomUUID();

    if (body.value === 1) host.upvoted = true;
    else host.downvoted = true;

    return HttpResponse.json({
      id: crypto.randomUUID(),
      target_user: body.target_user,
      value: body.value,
      created_at: new Date().toISOString(),
    });
  }),

  // Update Vote Handler
  http.patch(
    `${ENV.API_BASE_URL}/general/votes/:voteId`,
    async ({ request, params }) => {
      const voteId = params.voteId;
      const body = (await request.json()) as { value: 1 | -1 };

      const host = allHosts.find((h) => h.vote_id === voteId);

      if (!host) {
        return HttpResponse.json(
          { message: "Vote not found" },
          { status: 404 }
        );
      }

      host.votes_score += body.value;;

      host.upvoted = body.value === 1;
      host.downvoted = body.value === -1;

      return HttpResponse.json({
        id: host.id,
        target_user: host.id,
        value: body.value,
        updated_at: new Date().toISOString(),
      });
    }
  ),

  // Delete Vote Handler
  http.delete(`${ENV.API_BASE_URL}/general/votes/:voteId`,
    async ({ params }) => {
      const voteId = params.voteId;

      const host = allHosts.find((h) => h.vote_id === voteId);

      if (!host) {
        return HttpResponse.json(
          { message: "Vote not found" },
          { status: 404 }
        );
      }

      if (host.upvoted) host.votes_score -= 1;
      if (host.downvoted) host.votes_score += 1;

      host.votes_count = Math.max(0, host.votes_count - 1);

      host.upvoted = false;
      host.downvoted = false;
      host.vote_id = undefined;

      return HttpResponse.json({ message: "Vote deleted successfully" });
    }
  ),
];
