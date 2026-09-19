import React from "react";
import { motion } from "framer-motion";

import { BookingCard } from "./BookingCard";
import type { Booking } from "../../api/bookings";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

interface BookingsGridProps {
  bookings: Booking[];
  onSelect?: (id: string) => void;
}


export const BookingsGrid: React.FC<BookingsGridProps> = ({ bookings, onSelect }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1
                 gap-6
                 sm:grid-cols-2
                 lg:grid-cols-3
                 xl:grid-cols-4"
    >
      {bookings.map((booking) => (
        <motion.div
          key={booking.id}
          variants={itemVariants}
        >
          <BookingCard booking={booking} onSelect={onSelect} />
        </motion.div>
      ))}
    </motion.div>
  );
};