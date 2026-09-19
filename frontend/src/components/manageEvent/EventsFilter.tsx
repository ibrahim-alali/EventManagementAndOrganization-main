import React, { useState } from "react";
import { Search, ChevronUp, ChevronDown, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { EventsFilterState } from "../../pages/organizer/EventsManage";

/* =======================
   Types
======================= */

interface EventsFilterProps {
  value: EventsFilterState;
  onChange: (value: EventsFilterState) => void;
}

/* =======================
   Component
======================= */

export const EventsFilter: React.FC<EventsFilterProps> = ({
  value,
  onChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* ---------- Sorting ---------- */
  const sortOptions: {
    label: string;
    value:
      | "date_asc"
      | "date_desc"
      | "title_asc"
      | "title_desc"
      | "newest"
      | "oldest";
  }[] = [
    { label: "Date (Old → New)", value: "date_asc" },
    { label: "Date (New → Old)", value: "date_desc" },
    { label: "Title (A–Z)", value: "title_asc" },
    { label: "Title (Z–A)", value: "title_desc" },
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
  ];

  const sortToOrderingMap: Record<
    (typeof sortOptions)[number]["value"],
    string
  > = {
    date_asc: "date",
    date_desc: "-date",
    title_asc: "title",
    title_desc: "-title",
    newest: "-created_at",
    oldest: "created_at",
  };

  const currentSortKey =
    Object.entries(sortToOrderingMap).find(
      ([, v]) => v === value.ordering
    )?.[0] ?? null;

  /* =======================
       Render
    ======================= */

  return (
    <motion.div
      className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 font-nata-sans-rg"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* ---------- Search ---------- */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search events..."
            value={value.search ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                search: e.target.value || undefined,
              })
            }
            className="w-full rounded-xl border py-2 pl-10 pr-4 outline-none
                       hover:bg-amber-50/20 focus:ring-1 focus:ring-amber-200"
          />
        </div>

        {/* ---------- Min Date ---------- */}
        <div className="relative">
          <Calendar
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="date"
            value={value.min_date ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                min_date: e.target.value || undefined,
              })
            }
            className="rounded-xl border py-2 pl-9 pr-4 text-sm outline-none
                       hover:bg-amber-50/20 focus:ring-1 focus:ring-amber-200"
          />
        </div>

        {/* ---------- Max Date ---------- */}
        <div className="relative">
          <Calendar
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="date"
            value={value.max_date ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                max_date: e.target.value || undefined,
              })
            }
            className="rounded-xl border py-2 pl-9 pr-4 text-sm outline-none
                       hover:bg-amber-50/20 focus:ring-1 focus:ring-amber-200"
          />
        </div>

        {/* ---------- Ordering ---------- */}
        <div className="relative w-56">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl
                       border px-4 py-2 text-sm text-gray-400 shadow-sm
                       outline-none transition hover:bg-amber-50/20
                       focus:ring-1 focus:ring-amber-200"
          >
            {sortOptions.find((o) => o.value === currentSortKey)?.label ??
              "Sort by"}

            {dropdownOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 mt-1 w-full overflow-hidden
                           rounded-xl border border-amber-300
                           bg-white"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange({
                        ...value,
                        ordering: sortToOrderingMap[option.value],
                      });
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition
                                          hover:bg-amber-500/10
                                          ${
                                            currentSortKey === option.value
                                              ? "font-semibold"
                                              : ""
                                          } `}
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
