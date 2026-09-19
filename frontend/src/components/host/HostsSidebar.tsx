import React from "react";
import { motion } from "framer-motion";

interface HostsSidebarProps {
  filters: {
    search?: string;
    min_score?: number;
    min_votes?: number;
    ordering?: string;
  };
  onChange: (
    newFilters: Partial<{
      search?: string;
      min_score?: number;
      min_votes?: number;
      ordering?: string;
    }>
  ) => void;
  onClear: () => void;
}

export const HostsSidebar: React.FC<HostsSidebarProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-24 rounded-[18px] bg-white p-6 shadow-[0_20px_40px_rgba(124,58,237,0.12)]"
    >
      {/* Title */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-nata-sans-bd text-sm">Refine Results</h2>
        <span className="rounded-full bg-violet-100 px-3 py-1 font-nata-sans-bd text-[11px] text-violet-700">
          Filters
        </span>
      </div>

      {/* Search */}
      <div className="mb-5">
        <p className="mb-2 font-nata-sans-eb text-[11px] tracking-widest text-gray-500">
          SEARCH
        </p>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search by name"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-600 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Rating */}
      <div className="mb-5">
        <p className="mb-3 font-nata-sans-eb text-[11px] tracking-widest text-gray-500">
          RATING
        </p>

        <div className="flex flex-col gap-4">
          {/* Min Score */}
          <div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={filters.min_score ?? ""}
              onChange={(e) =>
                onChange({
                  min_score: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder="e.g. 4.5"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-600 focus:bg-white focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Filter by average rating
            </p>
          </div>

          {/* Min Votes */}
          <div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              min={0}
              value={filters.min_votes ?? ""}
              onChange={(e) =>
                onChange({
                  min_votes: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder="e.g. 100"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-600 focus:bg-white focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Minimum number of ratings
            </p>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-7">
        <p className="mb-2 font-nata-sans-eb text-[11px] tracking-widest text-gray-500">
          SORT
        </p>

        <motion.select
          whileFocus={{ scale: 1.02 }}
          value={filters.ordering ?? ""}
          onChange={(e) => onChange({ ordering: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-600 focus:bg-white focus:outline-none"
        >
          <option value="">Default</option>
          <option value="-votes_score">Highest rating</option>
          <option value="-votes_count">Most votes</option>
          <option value="-created_at">Newest</option>
        </motion.select>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-2.5 text-sm font-bold text-white"
        >
          Apply
        </motion.button>
      </div>
    </motion.aside>
  );
};
