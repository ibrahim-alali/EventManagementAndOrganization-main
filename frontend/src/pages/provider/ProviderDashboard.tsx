import React from "react";
import { motion, type Variants } from "framer-motion";

// Dashboard Components
import { Stats } from "../../components/dashboard/provider/Stats";
import { QuickActions } from "../../components/dashboard/provider/QuickActions";
import { RecentBookingsRequests } from "../../components/dashboard/provider/RecentBookingsRequests.tsx";
import { YourVenues } from "../../components/dashboard/provider/YourVenues";


const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.97,
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.45,
            ease: "easeOut",
        },
    },
};

export const ProviderDashboard: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ===== Row 1: Stats (4 cards in one row) ===== */}
      <motion.div variants={itemVariants}>
        <Stats />
      </motion.div>

      {/* ===== Row 2: Two Columns ===== */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Quick Actions */}
        <motion.div
          className="flex flex-col gap-4"
          variants={itemVariants}
        >
          <QuickActions />
        </motion.div>

        {/* Right Column: Recent Booking Requests */}
        <motion.div
          className="flex flex-col gap-4"
          variants={itemVariants}
        >
          <RecentBookingsRequests />
        </motion.div>
      </div>

      {/* ===== Row 3: Your Venues (3 cards in one row) ===== */}
      <motion.div variants={itemVariants}>
        <YourVenues />
      </motion.div>
    </motion.div>
  );
};