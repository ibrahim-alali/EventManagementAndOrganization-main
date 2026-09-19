import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { registrationsManageApi } from "../api/registrationsManage";
import { getToken } from "../utils/authToken";

/* =======================
   Query Keys
======================= */

export const registrationsManageKeys = {
  all: (token: string) => ["organizer-registrations-manage", token] as const,
};

/* =======================
   Queries
======================= */

export const useGetOrganizerRegistrations = () => {
  const token = getToken();

  return useQuery({
    queryKey: registrationsManageKeys.all(token!),
    queryFn: () => registrationsManageApi.getRegistrations(),
  });
};

/* =======================
   Mutations
======================= */

export const useAcceptRegistration = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => registrationsManageApi.acceptRegistration(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: registrationsManageKeys.all(token!),
      });
      queryClient.invalidateQueries({ queryKey: ["client-registrations"] });
    },
  });
};

export const useRejectRegistration = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => registrationsManageApi.rejectRegistration(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: registrationsManageKeys.all(token!),
      });
      queryClient.invalidateQueries({ queryKey: ["client-registrations"] });
    },
  });
};

export const useCancelRegistrationByProvider = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => registrationsManageApi.canceledRegistration(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: registrationsManageKeys.all(token!),
      });
      queryClient.invalidateQueries({ queryKey: ["client-registrations"] });
    },
  });
};
