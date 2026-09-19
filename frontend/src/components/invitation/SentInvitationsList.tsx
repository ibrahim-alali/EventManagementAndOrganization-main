import React, { useMemo } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { type Invitations } from "../../api/invitations";

interface SentInvitationsListProps {
  invitations: Invitations[];
}

export const SentInvitationsList: React.FC<SentInvitationsListProps> = ({
  invitations,
}) => {

  // Sort invitations by creation date (oldest -> newest)
  const sortedInvitations = useMemo(() => {
    return [...invitations].sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );
  }, [invitations]);

  if (!sortedInvitations.length) {
    return (
      <p className="font-nata-sans-md text-sm text-gray-500">
        No invitations sent yet.
      </p>
    );
  }

  // Show only latest 5 (but ticket index is based on full sorted list)
  const latestInvitations = sortedInvitations.slice(-5);

  return (
    <div className="space-y-3">
      {latestInvitations.map((inv) => {
        const ticketIndex =
          sortedInvitations.findIndex((i) => i.id === inv.id) + 1;

        const ticketId = `TKT-${String(ticketIndex).padStart(5, "0")}`;

        return (
          <motion.div
            key={inv.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-all hover:bg-gray-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Left: Attendee + Event */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Check className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <p className="font-nata-sans-md text-gray-800">
                  {inv.guest_name}
                </p>
                <p className="text-sm text-gray-500">
                  {inv.receiver_phone} • <span className="text-amber-600">{inv.event.title}</span>
                </p>
              </div>
            </div>

            {/* Right: Ticket ID + Date */}
            <div className="text-right">
              <p className="font-mono text-sm font-semibold text-amber-600">
                {ticketId}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(inv.created_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
