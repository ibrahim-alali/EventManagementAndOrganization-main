import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";

/* =======================
   Types
======================= */

type ActionType = "accept" | "reject" | "cancel";
type TargetType = "booking" | "registration";

interface BookingActionModalProps {
  open: boolean;
  action: ActionType;
  target: TargetType;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/* =======================
   Config
======================= */

const actionConfig: Record<
  TargetType,
  Record<ActionType,
    {
      title: string;
      description: string;
      confirmText: string;
      icon: any;
      iconBg: string;
      iconColor: string;
      confirmBtn: string;
    }
  >
> = {
  booking: {
    accept: {
      title: "Accept Booking",
      description: "Are you sure you want to accept this booking?",
      confirmText: "Accept Booking",
      icon: Check,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      confirmBtn: "bg-emerald-600 hover:bg-emerald-700",
    },
    reject: {
      title: "Reject Booking",
      description: "Are you sure you want to reject this booking?",
      confirmText: "Reject Booking",
      icon: X,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      confirmBtn: "bg-red-600 hover:bg-red-700",
    },
    cancel: {
      title: "Cancel Booking",
      description: "Are you sure you want to cancel this booking?",
      confirmText: "Cancel Booking",
      icon: AlertTriangle,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      confirmBtn: "bg-orange-600 hover:bg-orange-700",
    },
  },

  registration: {
    accept: {
      title: "Accept Registration",
      description: "Are you sure you want to accept this registration?",
      confirmText: "Accept Registration",
      icon: Check,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      confirmBtn: "bg-emerald-600 hover:bg-emerald-700",
    },
    reject: {
      title: "Reject Registration",
      description: "Are you sure you want to reject this registration?",
      confirmText: "Reject Registration",
      icon: X,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      confirmBtn: "bg-red-600 hover:bg-red-700",
    },
    cancel: {
      title: "Cancel Registration",
      description: "Are you sure you want to cancel this registration?",
      confirmText: "Cancel Registration",
      icon: AlertTriangle,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      confirmBtn: "bg-orange-600 hover:bg-orange-700",
    },
  },
};

/* =======================
   Component
======================= */

export const ActionConfirmModal: React.FC<BookingActionModalProps> = ({
  open,
  action,
  target,
  loading,
  onClose,
  onConfirm,
}) => {
  const config = actionConfig[target][action];
  const Icon = config?.icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md rounded-2xl bg-white p-6 font-nata-sans-rg shadow-xl"
          >
            {/* ---------- Icon ---------- */}
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center
                          rounded-full ${config.iconBg}`}
            >
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>

            {/* ---------- Content ---------- */}
            <div className="text-center">
              <h3 className="font-nata-sans-bd text-lg text-gray-800">
                {config.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{config.description}</p>
            </div>

            {/* ---------- Actions ---------- */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl border px-4 py-2 text-sm
                           text-gray-600 transition
                           hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 rounded-xl px-4 py-2 text-sm text-white
                            transition disabled:opacity-50
                            ${config.confirmBtn}`}
              >
                {loading ? "Processing..." : config.confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
