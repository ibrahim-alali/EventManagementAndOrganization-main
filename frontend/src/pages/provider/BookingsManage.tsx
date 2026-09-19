import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  useGetProviderBookings,
  useAcceptBooking,
  useRejectBooking,
  useCancelBookingByProvider,
} from "../../hooks/useBookingsManage";

import type { BookingStatus } from "../../api/bookings";

import { BookingFilter } from "../../components/manageBooking/BookingFilter";
import { BookingsTable } from "../../components/manageBooking/BookingsTable";
import { ActionConfirmModal } from "../../components/common/ActionConfirmModal";
import { ModalPortal } from "../../components/common/ModalPortal"

import { CalendarCheck } from "lucide-react";

/* =======================
   Types
======================= */

export type BookingFilterValue = {
  status: BookingStatus | "all";
  search?: string;
};

/* =======================
   Component
======================= */

export const BookingsManage: React.FC = () => {
  /* ---------- State ---------- */
  const [filter, setFilter] = useState<BookingFilterValue>({
    status: "all",
  });

  const [modal, setModal] = useState<{
    open: boolean;
    action?: "accept" | "reject" | "cancel";
    bookingId?: string;
  }>({ open: false });

  /* ---------- Queries ---------- */
  const {
    data: bookings = [],
    isLoading,
    isFetching,
  } = useGetProviderBookings({
    search: filter.search,
  });

  /* ---------- Mutations ---------- */
  const acceptMutation = useAcceptBooking();
  const rejectMutation = useRejectBooking();
  const cancelMutation = useCancelBookingByProvider();

  /* ---------- Handlers ---------- */
  const handleAccept = async (id: string) => {
    await toast.promise(acceptMutation.mutateAsync(id), {
      loading: "Accepting booking...",
      success: "Booking accepted",
      error: "Failed to accept booking",
    });
  };

  const handleReject = async (id: string) => {
    await toast.promise(rejectMutation.mutateAsync(id), {
      loading: "Rejecting booking...",
      success: "Booking rejected",
      error: "Failed to reject booking",
    });
  };

  const handleCancel = async (id: string) => {
    await toast.promise(cancelMutation.mutateAsync(id), {
      loading: "Cancelling booking...",
      success: "Booking cancelled",
      error: "Failed to cancel booking",
    });
  };

  /* ---------- Derived Data ---------- */
  const visibleBookings =
    filter.status === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter.status);

  /* =======================
     Render
  ======================= */

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="p-8 font-nata-sans-rg"
    >
      {/* ---------- Header ---------- */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <CalendarCheck />
            Manage Bookings
          </h1>
          <p className="pt-1 text-sm text-gray-500">
            Accept, reject, or cancel booking requests
          </p>
        </div>
      </div>

      {/* ---------- Filter ---------- */}
      <BookingFilter value={filter} onChange={setFilter} />

      {/* ---------- Table ---------- */}
      <BookingsTable
        bookings={visibleBookings}
        isLoading={isLoading || isFetching}
        onAccept={(id) =>
          setModal({
            open: true,
            action: "accept",
            bookingId: id,
          })
        }
        onReject={(id) =>
          setModal({
            open: true,
            action: "reject",
            bookingId: id,
          })
        }
        onCancel={(id) =>
          setModal({
            open: true,
            action: "cancel",
            bookingId: id,
          })
        }
      />

      <ModalPortal>
        <ActionConfirmModal
          open={modal.open}
          action={modal.action!}
          target="booking"
          loading={
            acceptMutation.isPending ||
            rejectMutation.isPending ||
            cancelMutation.isPending
          }
          onClose={() => setModal({ open: false })}
          onConfirm={async () => {
            if (!modal.bookingId || !modal.action) return;

            if (modal.action === "accept") {
              await handleAccept(modal.bookingId);
            } 
            if (modal.action === "reject") {
              await handleReject(modal.bookingId);
            }       
            if (modal.action === "cancel") {
              await handleCancel(modal.bookingId);
            }

            setModal({ open: false });
          }}
        />
      </ModalPortal>
    </motion.section>
  );
};
