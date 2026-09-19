import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  hostsApi,
  type FetchHostsParams,
  type HostsResponse,
  type UpdateVoteParams,
  type VoteRequest,
  type VoteResponse,
} from "../api/hosts";

const hostsKeys = {
  all: ["hosts"] as const,
  list: (params?: FetchHostsParams) => [...hostsKeys.all, params] as const,
}

// =====================
// Fetch Hosts
// =====================
export const useHosts = (params: FetchHostsParams) => {
  return useQuery<HostsResponse>({
    queryKey: hostsKeys.list(params),
    queryFn: () => hostsApi.fetchHosts(params),
    placeholderData: keepPreviousData,
  });
};

// =====================
// Vote for Host
// =====================
export const useVoteForHost = () => {
  const queryClient = useQueryClient();
  return useMutation<VoteResponse, Error, VoteRequest>({
    mutationFn: hostsApi.voteForHost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: hostsKeys.all,
      });
    },
  });
};

// =====================
// Update Vote
// =====================
export const useUpdateVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ voteId, value }: UpdateVoteParams) =>
      hostsApi.updateVote(voteId, { value }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostsKeys.all });
    },
  });
};

// =====================
// Delete for Host
// =====================
export const useDeleteVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voteId: string) => hostsApi.deleteVote(voteId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostsKeys.all });
    },
  });
};