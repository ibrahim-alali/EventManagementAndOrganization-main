import { useQuery } from "@tanstack/react-query";

import {
  providerDashboardApi,
  type ProviderStats,
  type RecentBooking,
  type ProviderVenue,
} from "../api/providerDashboard";

import { getToken } from "../utils/authToken";

/* =========================
   Query Keys
========================= */

export const providerDashboardKeys = {
  all: (token: string) => ["provider-dashboard", token] as const,

  stats: (token: string) => [...providerDashboardKeys.all(token), "stats"] as const,

  recentBookings: (token: string) =>
    [...providerDashboardKeys.all(token), "recent-bookings"] as const,

  venues: (token: string) => [...providerDashboardKeys.all(token), "venues"] as const,
};

/* =========================
   Hooks
========================= */

/**
 * Provider dashboard statistics
 * Used in <Stats />
 */
export const useProviderStats = () => {
  const token = getToken();

  return useQuery<ProviderStats>({
    queryKey: providerDashboardKeys.stats(token!),
    queryFn: providerDashboardApi.getProviderStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Recent booking requests
 * Used in <RecentBookingsRequests />
 */
export const useRecentBookingRequests = () => {
  const token = getToken();

  return useQuery<RecentBooking[]>({
    queryKey: providerDashboardKeys.recentBookings(token!),
    queryFn: providerDashboardApi.getRecentBookingRequests,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Provider venues
 * Used in <YourVenues />
 */
export const useProviderVenues = () => {
  const token = getToken();

  return useQuery<ProviderVenue[]>({
    queryKey: providerDashboardKeys.venues(token!),
    queryFn: providerDashboardApi.getProviderVenues,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
