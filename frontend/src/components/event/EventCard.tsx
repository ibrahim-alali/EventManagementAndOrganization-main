import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Users } from "lucide-react";
import { StarRating } from "../rating/StarRating";
import { EventTypeBadge } from "./EventTypeBadge";
import type { EventItem } from "../../api/events";

interface EventCardProps {
  event: EventItem;
  onSelect?: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {

  const attendanceRatio =
      event.capacity > 0
          ? event.attendance_count / event.capacity
          : 0;

  const attendancePercent = Math.min(attendanceRatio * 100, 100);

  const attendanceColor =
      attendanceRatio >= 1
          ? "bg-red-500"
          : attendanceRatio >= 0.7
              ? "bg-amber-500"
              : "bg-[#5a2ea6]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-[#5a2ea6] hover:shadow-md"
    >
      <span className="block p-1">
        <EventTypeBadge type={event.type} />
      </span>

      {/* Title */}
      <h3 className="mb-2 line-clamp-1 font-nata-sans-bd text-lg text-gray-800 transition group-hover:text-[#5a2ea6]">
        {event.title}
      </h3>

      {/* Description */}
      <p className="mb-4 line-clamp-2 whitespace-nowrap font-nata-sans-rg text-sm text-gray-600">
        {event.description}
      </p>

      {/* Date */}
      <div className="mb-2 flex items-center gap-2 font-nata-sans-md text-sm text-gray-500">
        <Calendar size={17} className="text-[#5a2ea6]" />
        <span>{event.date}</span>
      </div>

      {/* Time */}
      <div className="mb-4 flex items-center gap-2 font-nata-sans-md text-sm text-gray-500">
        <Clock size={17} className="text-[#5a2ea6]" />
        <span>
          {event.start_time} — {event.end_time}
        </span>
      </div>

      {/* Rating + Attendance */}
      <div className="mb-4 space-y-2 rounded-xl bg-[#f6f4fa] px-3 py-2 font-nata-sans-md shadow-sm">

        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Stars */}
          <StarRating
              rating={event.average_rating.average_rating}
              showValue={true}
          />

          {/* Participants count */}
          <div className="flex items-center gap-1 rounded-lg bg-[#f0e9fa] px-2 py-1 text-sm text-gray-500 shadow-inner">
            <Users size={16} className="text-[#5a2ea6]" />
            <span>{event.average_rating.count}</span>
          </div>
        </div>

        {/* Attendance */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={14} className="text-[#5a2ea6]" />
              Attendance
            </span>
            <span className="font-nata-sans-bd text-gray-700">
              {event.attendance_count} / {event.capacity}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e7def6]">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendancePercent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`h-full rounded-full ${attendanceColor}`}
            />
          </div>
        </div>
      </div>
      {/* Button */}
      <button
        onClick={() => onSelect?.(event.id)}
        className="inline-flex items-center gap-1 font-nata-sans-md text-sm text-[#5a2ea6] transition hover:text-purple-700"
      >
        View Details
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </button>
    </motion.div>
  );
};
