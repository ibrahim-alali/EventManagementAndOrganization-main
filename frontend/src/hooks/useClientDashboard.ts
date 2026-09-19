import { useQuery } from "@tanstack/react-query";
import { clientDashboardApi, type DashboardStatsResponse, type RecentActivityItem } from "../api/clientDashboard";
import { getToken } from "../utils/authToken";

export const useDashboardStats = () => {
  const token = getToken();

  return useQuery<DashboardStatsResponse>({
    queryKey: ["client-dashboard", "stats", token],
    queryFn: clientDashboardApi.getStats,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useRecentActivity = () => {
  const token = getToken();

  return useQuery<RecentActivityItem[]>({
    queryKey: ["client-dashboard", "recent-activity", token],
    queryFn: clientDashboardApi.getRecentActivity,
    staleTime: 1000 * 60 * 2, 
  });
};