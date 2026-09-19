import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  invitationsApi,
  type Invitations,
  type InvitationsRequest,
  type TicketsStats,
} from "../api/invitations";
import { getToken } from "../utils/authToken.ts";

/* =======================
   Query Keys
======================= */

const INVITATIONS_QUERY_KEY = (token: string) => ["invitations", token];
const TICKETS_STATS_QUERY_KEY = (token: string) => ["tickets-stats", token];

/* =======================
   Queries
======================= */

/**
 * Get all invitations
 */
export const useInvitations = () => {
  const token = getToken();
  return useQuery<Invitations[]>({
    queryKey: INVITATIONS_QUERY_KEY(token!),
    queryFn: invitationsApi.getAll,
  });
};

/**
 * Get tickets stats
 */
export const useTicketsStats = () => {
  const token = getToken();
  return useQuery<TicketsStats>({
    queryKey: TICKETS_STATS_QUERY_KEY(token!),
    queryFn: invitationsApi.getTicketsStats,
  });
};

/* =======================
   Mutations
======================= */

/**
 * Create invitation
 */
export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (data: InvitationsRequest) => invitationsApi.createInvitation(data),

    onSuccess: () => {
      // Refetch invitations list after creation
      queryClient.invalidateQueries({
        queryKey: INVITATIONS_QUERY_KEY(token!),
      });
    },
  });
};
