import React, { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

// Dashboard Components
import { Stats } from "../../components/dashboard/organizer/Stats";
import { QuickActions } from "../../components/dashboard/organizer/QuickActions";
import { RecentRegistrationsRequests } from "../../components/dashboard/organizer/RecentRegistrationsRequests";
import { UpcomingEvents } from "../../components/dashboard/organizer/UpcomingEvents";
import { EventForm } from "../../components/manageEvent/eventForm/EventForm";

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

export const OrganizerDashboard: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isCreateOpen && (
        <motion.div
          key="dashboard"
          className="flex flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {/* ===== Row 1: Stats (4 cards in one row) ===== */}
          <motion.div variants={itemVariants}>
            <Stats />
          </motion.div>

          {/* ===== Row 2: Two Columns ===== */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column: Quick Actions */}
            <motion.div className="flex flex-col gap-4" variants={itemVariants}>
              <QuickActions onOpen={() => setIsCreateOpen(true)} />
            </motion.div>

            {/* Right Column: Recent Booking Requests */}
            <motion.div className="flex flex-col gap-4" variants={itemVariants}>
              <RecentRegistrationsRequests />
            </motion.div>
          </div>

          {/* ===== Row 3: Your Venues (3 cards in one row) ===== */}
          <motion.div variants={itemVariants}>
            <UpcomingEvents onOpen={() => setIsCreateOpen(true)} />
          </motion.div>
        </motion.div>
      )}

      {isCreateOpen && (
        <motion.div
          key="event-form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
        >
          <EventForm mode="create" onClose={() => setIsCreateOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
