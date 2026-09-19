import React from "react";
import { motion } from "framer-motion";
import { Phone, Clock, User, Fingerprint, CheckCircle } from "lucide-react";
import { type Invitations } from "../../api/invitations";

interface TicketCardProps {
  ticket: Invitations;
  ticketId: string;
}

const ticketTypeConfig = {
  regular: {
    label: "Regular",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  vip: {
    label: "VIP",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },
  student: {
    label: "Student",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
  },
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, ticketId }) => {
  const type = ticketTypeConfig[ticket.ticket_type] ?? ticketTypeConfig.regular;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        flex flex-col overflow-hidden rounded-2xl
        border border-slate-200 bg-white shadow-sm
      "
    >
      {/* ================= Card Body ================= */}
      <div className="flex-1 p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-nata-sans-bd text-lg text-slate-900">
              {ticket.guest_name}
            </h3>

            <div className="mt-1 flex items-center gap-2">
              {/* Ticket Type */}
              <span
                className={`
                  inline-flex items-center rounded-full border
                  px-2.5 py-0.5 font-nata-sans-md
                  text-xs ${type.badge}
                `}
              >
                {type.label}
              </span>

              {/* WhatsApp */}
              {ticket.send_via_whatsapp && (
                <span
                  className="
                    inline-flex items-center gap-1
                    rounded-full border
                    border-green-200 bg-green-50
                    px-2 py-0.5 font-nata-sans-md
                    text-xs text-green-600
                  "
                >
                  <CheckCircle className="h-3 w-3" />
                  Sent
                </span>
              )}
            </div>
          </div>

          <div
            className="
              flex h-11 w-11 items-center
              justify-center rounded-xl
              border border-slate-200 bg-slate-50
              text-slate-400
            "
          >
            <User className="h-5 w-5" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-slate-400" />
            <span className="font-nata-sans-md">{ticket.receiver_phone}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>{formatDate(ticket.created_at)}</span>
          </div>

          <div className="flex items-center gap-3">
            <Fingerprint className="h-4 w-4 text-slate-400" />
            <span
              className="truncate font-mono text-xs text-slate-500"
              title={ticketId}
            >
              ID: {ticketId}
            </span>
          </div>
        </div>

        {/* QR */}
        <div
          className="
            group relative mt-6 flex
            justify-center rounded-xl
            border border-slate-100 bg-slate-50 p-4
          "
        >
          <img
            src={ticket.qr_code_image}
            alt="QR Code"
            className="
              h-32 w-32 object-contain
              mix-blend-multiply
            "
          />
        </div>
      </div>

      {/* ================= Footer ================= */}
      <div
        className="
          flex items-center justify-between
          border-t border-slate-200
          bg-slate-50 px-5 py-3
        "
      >
        <span className="font-nata-sans-md text-xs uppercase text-slate-500">
          Status
        </span>

        <span className="flex items-center gap-2 font-nata-sans-bd text-xs text-slate-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          {ticket.status.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
};
