import axiosClient from "./axiosClient";

export type HostRole = "organizer" | "provider";

export interface Host {
  id: number;
  full_name: string;
  email: string;
  role: HostRole;
  created_at: string;
  vote_id?: string; // Important
  votes_score: number;
  votes_count: number;
  upvoted: boolean; 
  downvoted: boolean;
}

export interface HostsResponse {
  total: number;
  page: number;
  page_size: number;
  results: Host[];
}

// Params
export interface FetchHostsParams {
  role: HostRole;
  search?: string;
  min_score?: number;
  min_votes?: number;
  ordering?: string;
  page: number;
  page_size: number;
}

export interface VoteRequest {
  target_user: number;
  value: 1 | -1;
}

export interface UpdateVoteRequest {
  value: 1 | -1;
}

export interface UpdateVoteParams {
  voteId: string;
  value: 1 | -1;
}

export interface VoteResponse {
  id: string;
  target_user: number;
  value: number;
  created_at: string;
}

export const hostsApi = {
  // -------- Fetch Hosts (Organizers / Providers) --------
  fetchHosts: async (filters: FetchHostsParams): Promise<HostsResponse> => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);

    if (filters.min_score !== undefined)
      params.append("min_score", String(filters.min_score));

    if (filters.min_votes !== undefined)
      params.append("min_votes", String(filters.min_votes));

    if (filters.ordering) params.append("ordering", filters.ordering);

    params.append("page", String(filters.page));
    params.append("page_size", String(filters.page_size));

    const endpoint =
      filters.role === "provider" ? "/auth/providers" : "/auth/organizers";

    const res = await axiosClient.get(`${endpoint}?${params.toString()}`);

    return res.data;
  },

  // -------- Vote (Create) --------
  voteForHost: async (payload: VoteRequest): Promise<VoteResponse> => {
    const res = await axiosClient.post("/general/votes", payload);
    return res.data;
  },

  // -------- Vote (Update) --------
  updateVote: async (voteId: string, payload: UpdateVoteRequest): Promise<VoteResponse> => {
    const res = await axiosClient.patch(`/general/votes/${voteId}`,
      payload
    );
    return res.data;
  },

  // -------- Vote (Delete) --------
  deleteVote: async (voteId: string): Promise<void> => {
    await axiosClient.delete(`/general/votes/${voteId}`);
  },
};
