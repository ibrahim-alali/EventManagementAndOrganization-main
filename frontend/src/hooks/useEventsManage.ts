import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  eventsManageApi,
  type Event,
  type FetchEventsParams,
  type CreateEventPayload,
  type UpdateEventPayload,
} from "../api/eventsManage";

import { getToken } from "../utils/authToken";
import type { Booking } from "../api/bookings";

/* =======================
   Query Keys
======================= */

const EVENTS_KEYS = {
  all: (token: string) => ["organizer-events-manage", token] as const,
  list: (filters: FetchEventsParams, token: string) =>
    [EVENTS_KEYS.all(token), filters] as const,
  archived: (filters: FetchEventsParams, token: string, ) =>
    ["archived-events", filters, token] as const,
  bookings: (filters: FetchEventsParams, token: string, ) =>
    ["organizer-bookings", filters, token] as const,
};

/* =======================
   Queries
======================= */

export const useEventsQuery = (filters: FetchEventsParams) => {
  const token = getToken();

  return useQuery<Event[]>({
    queryKey: EVENTS_KEYS.list(filters, token!),
    queryFn: () => eventsManageApi.getEvents(filters),
  });
};

export const useEventsArchiveQuery = (filters: FetchEventsParams) => {
  const token = getToken();

  return useQuery<Event[]>({
    queryKey: EVENTS_KEYS.archived(filters, token!),
    queryFn: () => eventsManageApi.getArchivedEvents(filters),
  });
};

export const useMyBookingsQuery = (filters: FetchEventsParams) => {
  const token = getToken();

  return useQuery<Booking[]>({
    queryKey: EVENTS_KEYS.bookings(filters, token!),
    queryFn: () => eventsManageApi.getMyBookings(filters),
  });
};

/* =======================
   Mutations
======================= */

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) =>
      eventsManageApi.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_KEYS.all(token!) });
      queryClient.invalidateQueries({ queryKey: ["client-events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: UpdateEventPayload) =>
      eventsManageApi.updateEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_KEYS.all(token!) });
      queryClient.invalidateQueries({ queryKey: ["client-events"] });
    },
  });
};

export const useArchiveEvent = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => eventsManageApi.archiveEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_KEYS.all(token!) });
      queryClient.invalidateQueries({ queryKey: ["archived-events"] });
    },
  });
};

export const useUnArchiveEvent = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => eventsManageApi.unArchiveEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_KEYS.all(token!) });
      queryClient.invalidateQueries({ queryKey: ["archived-events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => eventsManageApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_KEYS.all(token!) });
      queryClient.invalidateQueries({ queryKey: ["client-events"] });
    },
  });
};
