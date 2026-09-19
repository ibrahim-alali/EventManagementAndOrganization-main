import axiosClient from "./axiosClient";
import type { VenueLocation } from "./venuesManage";

// ===== Types =====
export interface VenueItem {
  id: string;
  name: string;
  description: string;
  location_geo: VenueLocation;
  capacity: number;
  price_per_hour: string;
  created_at: string;
  updated_at: string;
  provider: Provider;
  images: VenueImage[];
  average_rating: AverageRating;
}

export interface VenuesResponse {
  results: VenueItem[];
  total?: number;
  page?: number;
  page_size?: number;
}

interface Provider {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
}

export interface VenueImage {
  id?: string;
  image_url: string;
  image_size?: number;
  alt_text: string;
  is_cover: boolean;
}

export interface AverageRating {
  average_rating: number;
  count: number;
}

export interface VenueBooking {
  id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  created_at: string;
}

export interface VenueDetails extends VenueItem {
  bookings: VenueBooking[];
}

// ===== Params =====
export interface FetchVenuesParams {
  search?: string;
  min_capacity?: number;
  max_capacity?: number;
  min_price?: number;
  max_price?: number;
  ordering?: string;
  provider?: number;
  page: number;
  page_size: number;
}

// ===== API =====
export const venuesApi = {
  fetchVenues: async (filters: FetchVenuesParams): Promise<VenuesResponse> => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.min_capacity) params.append("min_capacity", String(filters.min_capacity));
    if (filters.max_capacity) params.append("max_capacity", String(filters.max_capacity));
    if (filters.min_price) params.append("min_price", String(filters.min_price));
    if (filters.max_price) params.append("max_price", String(filters.max_price));
    if (filters.ordering) params.append("ordering", filters.ordering);
    if (filters.provider) params.append("provider", String(filters.provider));

    params.append("page", String(filters.page));
    params.append("page_size", String(filters.page_size));

    const res = await axiosClient.get(`/venues/public?${params.toString()}`);
    return res.data;
  },

  fetchVenueById: async (id: string): Promise<VenueDetails> => {
    const res = await axiosClient.get(`/venues/public/${id}`);
    return res.data;
  },

  fetchVenuesRecommendations: async (): Promise<VenuesResponse> => {
    const res = await axiosClient.get("recommendation/recommendations/venues");
    return res.data;
  }
};
