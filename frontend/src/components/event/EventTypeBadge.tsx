import React from "react";
import { motion } from "framer-motion";
import type { EventType } from "../../api/events";

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  seminar: "Seminar",
  workshop: "Workshop",
  lecture: "Lecture",
  panel: "Panel",
  roundedTable: "Round Table",
  networking: "Networking",
  webinar: "Webinar",
  training: "Training",
  discussion: "Discussion",
  exhibition: "Exhibition",
  conference: "Conference",
};

type Props = {
  type: EventType;
};

export const EventTypeBadge: React.FC<Props> = ({ type }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        absolute right-0.5 top-0.5 z-20
        inline-flex items-center gap-1.5
        rounded-full
        border border-violet-500/20
        bg-gradient-to-r from-violet-800/40 to-purple-800/30
        px-3 py-1

        font-nata-sans-bd text-[11px]
        tracking-wide text-white

        shadow-lg shadow-violet-500/20
        backdrop-blur-md

        transition-all duration-300
        group-hover:translate-y-[-1px]
        group-hover:from-violet-800/60
        group-hover:to-purple-800/50
        group-hover:shadow-xl
    "
    >
      {/* Animated dot */}
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-white"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      />

      {EVENT_TYPE_LABEL[type]}
    </motion.span>
  );
};
