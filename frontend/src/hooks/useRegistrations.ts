import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registrationsApi,
  type GetRegistrationsParams,
  type Registration,
  type CreateRegistrationPayload,
  type UpdateRegistrationPayload,
} from "../api/registrations";
import { getToken } from "../utils/authToken";

export const useRegistrations = (params?: GetRegistrationsParams) => {
  const token = getToken();

  return useQuery<Registration[]>({
    queryKey: ["client-registrations", params, token],
    queryFn: () => registrationsApi.getRegistrations(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateRegistration = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: CreateRegistrationPayload) =>
      registrationsApi.createRegistration(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-registrations", token],
      });
    },
  });
};

export const useUpdateRegistration = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRegistrationPayload;
    }) => registrationsApi.updateRegistration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-registrations", token],
      });
    },
  });
};

export const useDeleteRegistration = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => registrationsApi.deleteRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-registrations", token],
      });
    },
  });
};
