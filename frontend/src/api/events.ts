import axiosClient from "./axiosClient";
import type { VenueLocation } from "./venuesManage.ts";
import type { AverageRating } from "./venues.ts";

// ===== Types =====
export interface EventItem {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  attendance_count: number;
  organizer: Organizer;
  average_rating: AverageRating;
  is_registered: boolean;
}

export type EventType =
  | "seminar"
  | "workshop"
  | "lecture"
  | "panel"
  | "roundedTable"
  | "networking"
  | "webinar"
  | "training"
  | "discussion"
  | "exhibition"
  | "conference";

export interface EventsResponse {
  results: EventItem[];
  total?: number;
  page?: number;
  page_size?: number;
}

interface Organizer {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
}

interface VenueImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_cover: boolean;
}

interface Venue {
  id: string;
  name: string;
  location_geo: VenueLocation;
  capacity: number;
  images: VenueImage[];
  average_rating: AverageRating;
}

export interface EventDetails {
  id: string;
  organizer: Organizer;
  venue: Venue;
  is_registered: boolean;
  created_at: string;
}

// ===== Params =====
export interface FetchEventsParams {
  search?: string;
  min_date?: string;
  max_date?: string;
  ordering?: string;
  organizer?: number;
  page: number;
  page_size: number;
}

// ===== API =====
export const eventsApi = {
  fetchEvents: async (filters: FetchEventsParams): Promise<EventsResponse> => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.min_date) params.append("min_date", filters.min_date);
    if (filters.max_date) params.append("max_date", filters.max_date);
    if (filters.ordering) params.append("ordering", filters.ordering);
    if (filters.organizer) params.append("organizer", String(filters.organizer));

    params.append("page", String(filters.page));
    params.append("page_size", String(filters.page_size));

    const res = await axiosClient.get(`/events/public?${params.toString()}`);
    return res.data;
  },

  fetchEventById: async (id: string): Promise<EventDetails> => {
    const res = await axiosClient.get(`/events/public/${id}`);
    return res.data;
  },

  fetchEventsRecommendations: async (): Promise<EventsResponse> => {
    const res = await axiosClient.get("/recommendation/recommendations/events");
    return res.data;
  },
};
