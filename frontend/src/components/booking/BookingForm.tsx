import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {motion} from "framer-motion";
import toast from "react-hot-toast";

import {useCreateBooking, useUpdateBooking} from "../../hooks/useBookings";
import type {Booking} from "../../api/bookings";

/* ================= Schema ================= */

const bookingSchema = z.object({
    date: z.string().min(1),
    start_time: z.string().min(1),
    end_time: z.string().min(1),
    notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

/* ================= Props ================= */

interface BookingFormProps {
    booking?: Booking; // undefined => create
    venueId?: string;
    onClose: () => void;
}

/* ================= Component ================= */

export const BookingForm: React.FC<BookingFormProps> = ({
                                                            booking,
                                                            venueId,
                                                            onClose,
                                                        }) => {
    const location = useLocation();
    const isOrganizer = location.pathname === "/organizer/venues" || location.pathname === "/organizer/bookings";

    const createMutation = useCreateBooking();
    const updateMutation = useUpdateBooking();
    const navigate = useNavigate();
    const isEdit = Boolean(booking);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            date: booking?.date || "",
            start_time: booking?.start_time || "",
            end_time: booking?.end_time || "",
            notes: booking?.notes || "",
        },
    });

    const onSubmit = (data: BookingFormData) => {
        const payload = {
            venue_id: venueId!,
            ...data,
        };

        if (isEdit) {
            updateMutation.mutate(
                {
                    id: booking!.id,
                    payload,
                },
                {
                    onSuccess: () => {
                        toast.success("Booking updated successfully");
                        onClose();
                    },
                    onError: () => {
                        toast.error("Failed to update booking");
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Booking created successfully");
                    onClose();
                    setTimeout(() => {
                        if (!isOrganizer) navigate("/client/bookings");
                        else navigate("/organizer/bookings")
                    }, 1000);
                },
                onError: () => {
                    toast.error("Failed to create booking");
                },
            });
        }
    };

    /* ================= UI ================= */

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            className="space-y-4 font-nata-sans-rg"
        >
            {/* Date */}
            <div>
                <label className="mb-1 block text-sm text-gray-600">Date</label>
                <input
                    type="date"
                    {...register("date")}
                    className={`w-full rounded-xl border border-gray-300 px-4 py-2.5
                        text-sm focus:outline-none
                        ${isOrganizer ? "focus:border-amber-400"
                        : "focus:border-violet-400"}
                    `}
                />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Start time</label>
                    <input
                        type="time"
                        {...register("start_time")}
                        className={`w-full rounded-xl border border-gray-300 px-4 py-2.5
                        text-sm focus:outline-none
                        ${isOrganizer ? "focus:border-amber-400"
                            : "focus:border-violet-400"}
                       `}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-600">End time</label>
                    <input
                        type="time"
                        {...register("end_time")}
                        className={`w-full rounded-xl border border-gray-300 px-4 py-2.5
                        text-sm focus:outline-none
                        ${isOrganizer ? "focus:border-amber-400"
                            : "focus:border-violet-400"}
                       `}
                    />
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="mb-1 block text-sm text-gray-600">Notes</label>
                <textarea
                    {...register("notes")}
                    rows={3}
                    placeholder="Optional notes..."
                    className={`w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5
                      text-sm focus:outline-none
                      ${isOrganizer ? "focus:border-amber-400"
                        : "focus:border-violet-400"}
          `}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                className={`w-full rounded-xl py-2.5
                  ${isOrganizer ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-indigo-500 hover:bg-indigo-600"}
                  font-nata-sans-md text-white transition active:scale-[0.98]`}
            >
                {isEdit ? "Update Booking" : "Create Booking"}
            </button>
        </motion.form>
    );
};
