import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { type Invitations } from "../../api/invitations";
import { TicketCard } from "./TicketCard";

interface GuestGridProps {
  invitations?: Invitations[];
  isLoading?: boolean;
}

export const GuestGrid: React.FC<GuestGridProps> = ({
  invitations,
  isLoading,
}) => {
  const sortedInvitations = useMemo(() => {
    if (!invitations) return [];
    return [...invitations].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, [invitations]);
  
  if (isLoading) {
    return (
      <div className="py-20 text-center font-nata-sans-md text-slate-400">
        Loading guests...
      </div>
    );
  }

  if (!sortedInvitations || sortedInvitations.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-nata-sans-md text-slate-500">No guests found</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {sortedInvitations.map((ticket, index) => {
        const ticketId = `TKT-${String(index + 1).padStart(5, "0")}`;

        return (
          <TicketCard key={ticket.id} ticket={ticket} ticketId={ticketId} />
        );
      })}
    </motion.div>
  );
};
