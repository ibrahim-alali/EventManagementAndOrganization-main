import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  venuesApi,
  type VenuesResponse,
  type VenueDetails,
  type FetchVenuesParams,
} from "../api/venues";
import { getToken } from "../utils/authToken.ts";

export const useVenues = (filters: FetchVenuesParams) => {
  return useQuery<VenuesResponse>({
    queryKey: ["client-venues", filters],
    queryFn: () => venuesApi.fetchVenues(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};

export const useVenue = (venueId: string | null) => {
  return useQuery<VenueDetails>({
    queryKey: ["client-venue", venueId],
    queryFn: () => venuesApi.fetchVenueById(venueId!),
    enabled: !!venueId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useVenuesRecommendations = () => {
  const token = getToken();
  return useQuery<VenuesResponse>({
    queryKey: ["client-venue-recommendations", token!],
    queryFn: venuesApi.fetchVenuesRecommendations,
  });
};
