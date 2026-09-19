import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { motion } from "framer-motion";

import type { CalendarEvent } from "../../pages/provider/BookingsCalendar";

/* =======================
   Props
======================= */

interface BookingsCalendarProps {
  events: CalendarEvent[];
  onHover: (bookingId: string) => void;
  onLeave: () => void;
}

/* =======================
   Component
======================= */

export const BookingCalendar: React.FC<BookingsCalendarProps> = ({ events, onHover, onLeave }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-emerald-50/50"
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day"
        }}
        eventMouseEnter={(info) => {
          onHover(info.event.id);
        }}
        eventMouseLeave={() => {
          onLeave();
        }}
        dayMaxEvents={3}
        nowIndicator={true}
      />
    </motion.div>
  );
};
