import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

import type { BookingStatus } from "../../api/bookings";
import type { BookingFilterValue } from "../../pages/provider/BookingsManage";

/* =======================
   Props
======================= */

interface BookingFilterProps {
  value: BookingFilterValue;
  onChange: (value: BookingFilterValue) => void;
}

/* =======================
   Component
======================= */

export const BookingFilter: React.FC<BookingFilterProps> = ({
  value,
  onChange,
}) => {
  const [statusOpen, setStatusOpen] = useState(false);

  const statusOptions: {
    label: string;
    value: BookingStatus | "all";
  }[] = [
    { label: "All Bookings", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Canceled", value: "canceled" },
  ];

  const currentStatus =
    statusOptions.find((o) => o.value === value.status)?.label ??
    "All Bookings";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 font-nata-sans-rg"
    >
      <div className="flex flex-col gap-4 md:flex-row">
        {/* ---------- Search ---------- */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search bookings..."
            value={value.search ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                search: e.target.value || undefined,
              })
            }
            className="w-full rounded-xl border py-2 pl-10 pr-4 outline-none
                       transition hover:bg-emerald-50/20
                       focus:ring-1 focus:ring-emerald-300"
          />
        </div>

        {/* ---------- Status Dropdown ---------- */}
        <div className="relative w-56">
          <button
            onClick={() => setStatusOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl
                       border px-4 py-2 text-sm text-gray-500 shadow-sm
                       transition hover:bg-emerald-50/20
                       focus:ring-1 focus:ring-emerald-300"
          >
            {currentStatus}

            {statusOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {statusOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 mt-1 w-full overflow-hidden
                           rounded-xl border border-emerald-300
                           bg-white shadow-lg"
              >
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange({
                        ...value,
                        status: option.value,
                      });
                      setStatusOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition hover:bg-emerald-500/10
                      ${
                        value.status === option.value
                          ? "font-nata-sans-md text-emerald-600"
                          : ""
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
