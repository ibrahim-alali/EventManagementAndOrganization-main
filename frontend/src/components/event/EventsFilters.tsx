import React from "react";
import { motion } from "framer-motion";
import { Search, Calendar, ChevronDown } from "lucide-react";

interface EventsFiltersProps {
  filters: {
    search: string;
    min_date: string;
    max_date: string;
    ordering: string;
  };
  onChange: (
    newFilters: Partial<{
      search: string;
      min_date: string;
      max_date: string;
      ordering: string;
    }>
  ) => void;
}

export const EventsFilters: React.FC<EventsFiltersProps> = ({
  filters,
  onChange,
}) => {
  return (
    <motion.div
      className="mx-auto my-5 flex w-full max-w-4xl flex-col gap-4 rounded-3xl bg-white p-5 shadow-md sm:flex-row"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search events..."
          className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 font-nata-sans-rg text-sm transition-all focus:border-[#5a2ea6]"
        />
      </div>

      {/* Min Date */}
      <div className="relative">
        <Calendar
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />

        <input
          type="date"
          value={filters.min_date}
          onChange={(e) => onChange({ min_date: e.target.value })}
          className="hide-date-icon rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 font-nata-sans-rg text-sm transition focus:border-[#5a2ea6]"
        />
      </div>

      {/* Max Date */}
      <div className="relative">
        <Calendar
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="date"
          value={filters.max_date}
          onChange={(e) => onChange({ max_date: e.target.value })}
          className="hide-date-icon rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 font-nata-sans-rg text-sm transition focus:border-[#5a2ea6]"
        />
      </div>

      {/* Ordering */}
      <div className="relative">
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <select
          value={filters.ordering}
          onChange={(e) => onChange({ ordering: e.target.value })}
          className="appearance-none rounded-xl border border-gray-300 px-6 py-2.5 font-nata-sans-rg text-sm transition focus:border-[#5a2ea6]"
        >
          <option value="">Sort by</option>
          <option value="date">Date ↑</option>
          <option value="-date">Newest ↓</option>
          <option value="title">Title A-Z ↓</option>
          <option value="-title">Title Z-A ↑</option>
        </select>
      </div>
    </motion.div>
  );
};
