import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  eventsApi,
  type EventsResponse,
  type EventDetails,
  type FetchEventsParams,
} from "../api/events";
import { getToken } from "../utils/authToken.ts";

export const useEvents = (filters: FetchEventsParams) => {
  return useQuery<EventsResponse>({
    queryKey: ["client-events", filters],
    queryFn: () => eventsApi.fetchEvents(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};

export const useEvent = (eventId: string | null) => {
  return useQuery<EventDetails>({
    queryKey: ["client-event", eventId],
    queryFn: () => eventsApi.fetchEventById(eventId!),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEventsRecommendations = () => {
  const token = getToken();
  return useQuery<EventsResponse>({
    queryKey: ["client-event-recommendations", token!],
    queryFn: eventsApi.fetchEventsRecommendations,
  });
};
