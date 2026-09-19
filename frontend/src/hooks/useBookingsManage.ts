import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { bookingsManageApi } from "../api/bookingsManage";
import { getToken } from "../utils/authToken";

/* =======================
   Query Keys
======================= */

export const bookingsManageKeys = {
    all: (token: string) => ["provider-bookings-manage", token] as const,

    list: (token: string, query?: { search?: string; ordering?: string }) =>
        [...bookingsManageKeys.all(token), query] as const,
};

/* =======================
   Queries
======================= */

export const useGetProviderBookings = (query?: {
    search?: string;
    ordering?: string;
}) => {
    const token = getToken();

    return useQuery({
        queryKey: bookingsManageKeys.list(token!, query),
        queryFn: () => bookingsManageApi.getBookings(query),
    });
};

/* =======================
   Mutations
======================= */

export const useAcceptBooking = () => {
    const queryClient = useQueryClient();
    const token = getToken();

    return useMutation({
        mutationFn: (id: string) => bookingsManageApi.acceptBooking(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookingsManageKeys.all(token!),
            });
            queryClient.invalidateQueries({
                queryKey: ["client-bookings"],
            });
            queryClient.invalidateQueries({
                queryKey: ["organizer-bookings"],
            });
        },
    });
};

export const useRejectBooking = () => {
    const queryClient = useQueryClient();
    const token = getToken();

    return useMutation({
        mutationFn: (id: string) => bookingsManageApi.rejectBooking(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookingsManageKeys.all(token!),
            });
            queryClient.invalidateQueries({
                queryKey: ["client-bookings"],
            });
            queryClient.invalidateQueries({
                queryKey: ["organizer-bookings"],
            });
        },
    });
};

export const useCancelBookingByProvider = () => {
    const queryClient = useQueryClient();
    const token = getToken();

    return useMutation({
        mutationFn: (id: string) => bookingsManageApi.canceledBooking(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bookingsManageKeys.all(token!),
            });
            queryClient.invalidateQueries({
                queryKey: ["client-bookings"],
            });
            queryClient.invalidateQueries({
                queryKey: ["organizer-bookings"],
            });
        },
    });
};
