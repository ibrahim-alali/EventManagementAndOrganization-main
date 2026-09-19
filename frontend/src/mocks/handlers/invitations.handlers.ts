import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { delay } from "msw";

import {
  getInvitationsMock,
  createInvitationMock,
} from "../helpers/invitations.helpers";
import type { InvitationsRequest } from "../../api/invitations";
import { ticketsStats } from "../data/invitations.mock";

/**
 * Invitations API Handlers
 */
export const invitationsHandlers = [
  /**
   * GET /api/events/invitations
   */
  http.get(`${ENV.API_BASE_URL}/events/invitations`, async () => {
    const invitations = await getInvitationsMock();

    return HttpResponse.json(invitations, {
      status: 200,
    });
  }),

  /**
   * POST /api/events/invitations/create
   */
  http.post(`${ENV.API_BASE_URL}/events/invitations/create`, async ({ request }) => {
    const body = await request.json() as InvitationsRequest;

    const invitation = await createInvitationMock(body);

    return HttpResponse.json(invitation, {
      status: 201,
    });
  }),

  /**
   * GET /api/events/total-guests
   */
  http.get(`${ENV.API_BASE_URL}/events/total-guests`, async () => {
    const stats = ticketsStats;
    await delay(500);
    return HttpResponse.json(stats, {
      status: 200,
    });
  }),
];