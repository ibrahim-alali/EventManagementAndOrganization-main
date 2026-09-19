import { useQuery } from "@tanstack/react-query";

import {
  organizerDashboardApi,
  type DashboardStats,
  type RecentRegistration,
  type UpcomingEvent,
} from "../api/organizerDashboard";

import { getToken } from "../utils/authToken";

const KEYS = {
  root: (token: string) => ["organizer-dashboard", token] as const,
  stats: (token: string) => [...KEYS.root(token), "stats"] as const,
  recentRegistrations: (token: string) =>
    [...KEYS.root(token), "recent-registrations"] as const,
  upcomingEvents: (token: string) =>
    [...KEYS.root(token), "upcoming-events"] as const,
};

/**
 * Dashboard Stats
 */
export const useOrganizerStats = () => {
  const token = getToken();

  return useQuery<DashboardStats>({
    queryKey: KEYS.stats(token!),
    queryFn: organizerDashboardApi.getOrganizerStats,
  });
};

/**
 * Recent Registrations
 */
export const useOrganizerRecentRegistrations = () => {
  const token = getToken();

  return useQuery<RecentRegistration[]>({
    queryKey: KEYS.recentRegistrations(token!),
    queryFn: organizerDashboardApi.getRecentRegistrations,
  });
};

/**
 * Upcoming Events
 */
export const useOrganizerUpcomingEvents = () => {
  const token = getToken();

  return useQuery<UpcomingEvent[]>({
    queryKey: KEYS.upcomingEvents(token!),
    queryFn: organizerDashboardApi.getUpcomingEvents,
  });
};
