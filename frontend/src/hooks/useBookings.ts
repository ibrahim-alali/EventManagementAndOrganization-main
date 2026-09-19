import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookingsApi,
  type GetBookingsParams,
  type Booking,
  type CreateBookingPayload,
  type UpdateBookingPayload,
} from "../api/bookings";
import { getToken } from "../utils/authToken";

export const useBookings = (params?: GetBookingsParams) => {
  const token = getToken();
  return useQuery<Booking[]>({
    queryKey: ["client-bookings", params, token],
    queryFn: () => bookingsApi.getBookings(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      bookingsApi.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-bookings", token],
      });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingPayload }) =>
      bookingsApi.updateBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-bookings", token],
      });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) => bookingsApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-bookings", token],
      });
    },
  });
};
