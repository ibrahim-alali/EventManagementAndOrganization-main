import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useGetProviderBookings } from "../../hooks/useBookingsManage";
import type { Bookings } from "../../api/bookingsManage";

import { BookingCalendar } from "../../components/manageBooking/BookingCalendar";
import { BookingTooltip } from "../../components/manageBooking/BookingTooltip";

/* =======================
   Types
======================= */

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

/* =======================
   Component
======================= */

export const BookingsCalendar: React.FC = () => {
  const { data, isLoading, isError } = useGetProviderBookings();

  const [hoveredBooking, setHoveredBooking] = useState<Bookings | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* =======================
     Data preparation
  ======================= */

  const approvedBookings = useMemo(() => {
    return data?.filter((booking: Bookings) => booking.status === "approved") ?? [];
  }, [data]);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return approvedBookings.map((booking) => ({
      id: booking.id,
      title: booking.venue_name,
      start: `${booking.date}T${booking.start_time}`,
      end: `${booking.date}T${booking.end_time}`,
    }));
  }, [approvedBookings]);

  /* =======================
     Handlers
  ======================= */

  const handleHoverBooking = (bookingId: string) => {
    const booking = approvedBookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setHoveredBooking(booking);
  };

  const handleLeaveBooking = () => {
    setHoveredBooking(null);
  };

  /* =======================
     States
  ======================= */

  if (isLoading) {
    return (
      <div className="flex h-[40rem] items-center justify-center py-12 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (isError) {
    toast.error("Loading bookings failed");
    return (
      <div className="flex h-[40rem] flex-col items-center justify-center gap-2 text-gray-600">
        <AlertCircle className="h-6 w-6" />
        <p className="font-nata-sans-md">Error occurred while data loading</p>
      </div>
    );
  }

  /* =======================
     Render
  ======================= */

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <CalendarDays className="h-6 w-6" />
        <h1 className="font-nata-sans-bd text-xl text-gray-800">Calendar Bookings</h1>
        <span className="rounded-full bg-emerald-100 px-3 py-0.5 font-nata-sans-rg text-xs font-semibold text-emerald-800">
          {approvedBookings.length} Approved
        </span>
      </div>

      {/* Calendar */}
      <BookingCalendar
        events={calendarEvents}
        onHover={handleHoverBooking}
        onLeave={handleLeaveBooking}
      />

      {/* Tooltip */}
      {hoveredBooking && <BookingTooltip booking={hoveredBooking} position={tooltipPos} />}
    </motion.section>
  );
};
