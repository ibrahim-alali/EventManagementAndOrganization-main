import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  venuesManageApi,
  type Venue,
  type CreateVenuePayload,
  type UpdateVenuePayload,
  type UploadVenueImagesPayload,
} from "../api/venuesManage";
import { getToken } from "../utils/authToken";

/* =======================
   Queries
======================= */

/* -------- GET VENUES -------- */
export const useVenuesQuery = (query?: { search?: string; ordering?: string }) => {
  const token = getToken();

  return useQuery<Venue[]>({
    queryKey: ["provider-venues-manage", query, token],
    queryFn: () => venuesManageApi.getVenues(query),
    staleTime: 1000 * 60,
  });
};

export const useVenuesArchiveQuery = (query?: { search?: string; ordering?: string }) => {
  const token = getToken();

  return useQuery<Venue[]>({
    queryKey: ["archived-venues", query, token],
    queryFn: () => venuesManageApi.getArchivedVenues(query),
    staleTime: 1000 * 60,
  });
};

/* =======================
   Mutations
======================= */

/* -------- CREATE VENUE -------- */
export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: CreateVenuePayload) => venuesManageApi.createVenue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-venues-manage", token] });
      queryClient.invalidateQueries({ queryKey: ["client-venues"] });
    },
  });
};

/* -------- UPDATE VENUE -------- */
export const useUpdateVenue = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: UpdateVenuePayload) => venuesManageApi.updateVenue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-venues-manage", token] });
      queryClient.invalidateQueries({ queryKey: ["client-venues"] });
    },
  });
};

/* -------- ARCHIVE VENUE -------- */
export const useArchiveVenue = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => venuesManageApi.archiveVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-venues-manage", token] });
      queryClient.invalidateQueries({ queryKey: ["archived-venues", token] });
    },
  });
};

export const useUnArchiveVenue = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => venuesManageApi.unArchiveVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-venues-manage", token] });
      queryClient.invalidateQueries({ queryKey: ["archived-venues", token] });
    },
  });
};

/* -------- DELETE VENUE -------- */
export const useDeleteVenue = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => venuesManageApi.deleteVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-venues-manage", token] });
      queryClient.invalidateQueries({ queryKey: ["client-venues"] });
    },
  });
};

export const useUploadVenueImages = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: UploadVenueImagesPayload) => venuesManageApi.uploadVenueImages(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-venues-manage", token] });
      queryClient.invalidateQueries({ queryKey: ["client-venues"] });
    },
  });
};

export const useDeleteVenueImage = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: venuesManageApi.deleteVenueImage,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-venues-manage", token] });
      queryClient.invalidateQueries({ queryKey: ["client-venues"] });
    },
  });
};
