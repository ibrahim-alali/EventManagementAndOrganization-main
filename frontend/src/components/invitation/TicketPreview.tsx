import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { type Invitations } from "../../api/invitations";
import { QRCodeCanvas } from "qrcode.react";

interface TicketPreviewProps {
  invitation: Invitations | null;
  invitations: Invitations[]; // full list for ticketId
}

export const TicketPreview: React.FC<TicketPreviewProps> = ({
  invitation,
  invitations,
}) => {
  // Sort invitations to get consistent ticket index
  const sortedInvitations = useMemo(
    () =>
      [...invitations].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ),
    [invitations],
  );

  const ticketIndex =
    sortedInvitations.findIndex((i) => i.id === invitation?.id) + 1;

  const ticketId = `TKT-${String(ticketIndex).padStart(5, "0")}`;

  return (
    <motion.div
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="mb-4 font-nata-sans-bd text-gray-800">
        Generated E-Ticket Preview
      </h4>

      {invitation ? (
        <div className="space-y-4">
          <div className="ticket-gradient mb-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 p-6 text-white">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">Event</p>
                <h3 className="font-nata-sans-bd text-xl">
                  {invitation.event.title}
                </h3>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 font-nata-sans-bd text-xs uppercase tracking-wide">
                {invitation.ticket_type}
              </span>
            </div>

            {/* Attendee & Date */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-80">Attendee</p>
                <p className="font-nata-sans-md">{invitation.guest_name}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Date</p>
                <p className="font-nata-sans-md">
                  {new Date(invitation.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="qr-container flex items-center justify-center rounded-xl bg-white/10 p-4">
              <QRCodeCanvas
                value={invitation.qr_code_text}
                size={120}
                bgColor="transparent"
                fgColor="white"
              />
            </div>

            <p className="mt-3 text-center font-nata-sans-md text-sm opacity-80">
              Scan this QR code at the venue
            </p>
          </div>

          {/* Ticket ID */}
          <p className="text-center font-mono text-sm text-gray-500">
            Ticket ID: {ticketId}
          </p>
        </div>
      ) : (
        <div className="flex min-h-full items-center justify-center">
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-amber-300 bg-white p-24 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <svg
                className="h-12 w-12 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>

            <h4 className="mb-1 font-nata-sans-md text-gray-600">
              No ticket generated
            </h4>
            <p className="font-nata-sans-rg text-sm text-gray-400">
              Fill the form to generate an e-ticket
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
