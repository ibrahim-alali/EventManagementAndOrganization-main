import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  CheckCircle2,
  Info,
  DollarSign,
} from "lucide-react";

import type { EventFormValues } from "../EventForm";
import type { Booking } from "../../../../api/bookings";

interface StepConfirmationProps {
  values: EventFormValues;
  booking: Booking;
  isSubmitting: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  canceled: "Canceled",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  canceled: "bg-gray-200 text-gray-600",
};

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  values,
  booking,
  isSubmitting,
  onConfirm,
  onBack,
}) => {
  const venue = booking.venue;
  const location = venue.location_geo;

  return (
  <div className="flex flex-col gap-6">
    {/* ================= Event Summary ================= */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-6"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-amber-500" />
        <h3 className="font-nata-sans-bd text-lg text-gray-800">
          Event Summary
        </h3>
      </div>

      {/* Content */}
      <div className="grid gap-5 text-sm text-gray-700 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <p className="text-xs text-gray-500">Title</p>
          <p className="font-nata-sans-bd text-base">{values.title}</p>
        </div>

        {/* Type */}
        <div>
          <p className="mb-1 text-xs text-gray-500">Type</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 font-nata-sans-md text-xs text-amber-700">
            <Tag size={14} />
            {values.type}
          </span>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2">
          <Users size={16} />
          {values.capacity} attendees
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          {values.date}
        </div>

        {/* Time */}
        <div className="flex items-center gap-2">
          <Clock size={16} />
          {values.startTime} – {values.endTime}
        </div>

        {/* Description */}
        <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2">
          <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
            <Info size={14} />
            Description
          </div>
          <p className="leading-relaxed text-gray-600">
            {values.description}
          </p>
        </div>
      </div>
    </motion.div>

    {/* ================= Venue & Booking ================= */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-xl border border-gray-200 bg-white p-6"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-amber-500" />
          <h3 className="font-nata-sans-bd text-lg text-gray-800">
            Venue & Booking
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 font-nata-sans-md text-xs ${STATUS_COLOR[booking.status]}`}
        >
          {STATUS_LABEL[booking.status]}
        </span>
      </div>

      {/* Content */}
      <div className="grid gap-5 text-sm text-gray-700 sm:grid-cols-2">
        {/* Venue name */}
        <div className="sm:col-span-2">
          <p className="font-nata-sans-bd text-base">{venue.name}</p>
          {venue.description && (
            <p className="text-gray-600">{venue.description}</p>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 sm:col-span-2">
            <MapPin size={16} />
            {location.area}, {location.city}
          </div>
        )}

        {/* Booking Date */}
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          {booking.date}
        </div>

        {/* Booking Time */}
        <div className="flex items-center gap-2">
          <Clock size={16} />
          {booking.start_time} – {booking.end_time}
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2">
          <Users size={16} />
          Capacity: {venue.capacity}
        </div>

        {/* Price */}
        {venue.price_per_hour && (
          <div className="flex items-center gap-2">
            <DollarSign size={16} />
            {venue.price_per_hour} / hour
          </div>
        )}
      </div>
      </motion.div>

      {/* ================= Actions ================= */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-5 py-2 font-nata-sans-md text-gray-700 transition hover:bg-gray-100"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2 font-nata-sans-bd text-white transition hover:bg-amber-600 disabled:opacity-60"
        >
          <CheckCircle2 size={18} />
          {isSubmitting ? "Confirming..." : "Confirm Event"}
        </button>
      </div>
    </div>
  );
};
