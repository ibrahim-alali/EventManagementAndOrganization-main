import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Users,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";
import Select from "react-select";
import type { SingleValue } from "react-select";

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#8b5cf6" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(139,92,246,0.2)" : "none",
    cursor: "pointer",
    overflow: "hidden",
    backgroundColor: "transparent",
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 8px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "#6b7280",
    padding: "4px",
    "&:hover": { color: "#4b5563" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: "999",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  }),
  menuList: (base: any) => ({
    ...base,
    padding: 0,
    overflowX: "hidden",
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: state.isSelected
      ? "#ede9fe"
      : state.isFocused
      ? "#f5f3ff"
      : "white",
    color: "#111827",
    cursor: "pointer",
  }),
};

const selectSmallFilterStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#22c55e" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(139,92,246,0.2)" : "none",
    cursor: "pointer",
    overflow: "hidden",
    backgroundColor: "transparent",
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 8px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "#6b7280",
    padding: "4px",
    "&:hover": { color: "#4b5563" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: "999",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  }),
  menuList: (base: any) => ({
    ...base,
    padding: 0,
    overflowX: "hidden",
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: state.isSelected
      ? "#ede9fe"
      : state.isFocused
      ? "#c2fcd7"
      : "white",
    color: "#111827",
    cursor: "pointer",
    "&:hover": { backgroundColor: "#d8ffe4" },
  }),
};

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

export const HostsClientSidebar: React.FC<HostsSidebarProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const hasActiveFilters = Boolean(
    filters.search || filters.min_score || filters.min_votes || filters.ordering
  );
  const activeFiltersCount = [
    filters.search,
    filters.min_score,
    filters.min_votes,
    filters.ordering,
  ].filter(Boolean).length;

  const sortOptions = [
    { value: "-votes_score", label: "Highest Rating" },
    { value: "votes_score", label: "Lowest Rating" },
    { value: "-votes_count", label: "Most Votes" },
    { value: "-created_at", label: "Newest First" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-4"
    >
      {/* Main Filter Bar */}
      <div
        className="w-full rounded-[18px] bg-white p-4 shadow-[0_20px_40px_rgba(124,58,237,0.12)]"
        style={{
          background: " linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)",
        }}
      >
        {/* Top Row - Search and Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
            />
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              value={filters.search ?? ""}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Search by name..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 font-nata-sans-rg text-sm transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {filters.search && (
              <button
                onClick={() => onChange({ search: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {/* Min Score */}
          <div className="relative">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <Star size={16} className="text-amber-400" />
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
                placeholder="Min Score"
                className="w-20 border-0 bg-transparent font-nata-sans-rg text-sm focus:outline-none"
              />
            </div>
          </div>
          {/* Min Votes */}
          <div className="relative">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <Users size={16} className="text-violet-500" />
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
                placeholder="Min Votes"
                className="w-20 border-0 bg-transparent font-nata-sans-rg text-sm focus:outline-none"
              />
            </div>
          </div>
          {/* Sort Dropdown */}
          <div className="relative">
            <div className="min-w-[170px] flex-1 rounded-xl bg-white font-nata-sans-rg text-sm">
              <Select
                instanceId="sort-by"
                placeholder="Sort By"
                options={sortOptions}
                value={
                  sortOptions.find((o) => o.value === filters.ordering) ?? null
                }
                onChange={(
                  option: SingleValue<{ value: string; label: string }>
                ) => onChange({ ordering: option?.value ?? "" })}
                styles={selectStyles}
                isClearable
              />
            </div>
          </div>
          {/* Advanced Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-nata-sans-rg text-sm font-medium transition-all ${
              showAdvanced
                ? "bg-violet-100 text-violet-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Advanced</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 font-nata-sans-bd text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </motion.button>
          {/* Clear Filters */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 font-nata-sans-md text-sm font-medium text-red-600 transition-all hover:bg-red-100"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Clear</span>
            </motion.button>
          )}
        </div>
        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Custom Min Score */}
                <div className="rounded-xl bg-amber-50 p-3">
                  <label className="mb-1.5 flex items-center gap-2 font-nata-sans-md text-xs font-semibold text-amber-800">
                    <Star size={14} className="text-amber-500" />
                    Minimum Rating
                  </label>
                  <input
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
                    className="w-full rounded-lg border-0 bg-white px-3 py-2 font-nata-sans-rg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                {/* Custom Min Votes */}
                <div className="rounded-xl bg-violet-50 p-3">
                  <label className="mb-1.5 flex items-center gap-2 font-nata-sans-md text-xs font-semibold text-violet-800">
                    <Users size={14} className="text-violet-500" />
                    Minimum Votes
                  </label>
                  <input
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
                    className="w-full rounded-lg border-0 bg-white px-3 py-2 font-nata-sans-rg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                {/* Sort Options */}
                <div className="rounded-xl bg-green-50 p-3 font-nata-sans-rg text-sm">
                  <label className="mb-1.5 flex items-center gap-2 font-nata-sans-md text-xs font-semibold text-green-800">
                    <ArrowUpDown size={14} className="text-green-500" />
                    Sort Order
                  </label>

                  <Select
                    instanceId="sort-order"
                    placeholder="Default"
                    options={sortOptions}
                    value={
                      sortOptions.find((o) => o.value === filters.ordering) ??
                      null
                    }
                    onChange={(
                      option: SingleValue<{ value: string; label: string }>
                    ) => onChange({ ordering: option?.value ?? "" })}
                    styles={selectSmallFilterStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    isClearable
                  />
                </div>
                {/* Quick Presets */}
                <div className="rounded-xl bg-blue-50 p-3">
                  <label className="mb-3 block font-nata-sans-md text-xs font-semibold text-blue-800">
                    Quick Presets
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() =>
                        onChange({ min_score: 4.5, ordering: "-votes_score" })
                      }
                      className="rounded-lg bg-white px-2 py-1 font-nata-sans-rg text-xs text-blue-700 shadow-sm transition hover:bg-blue-100"
                    >
                      Top Rated
                    </button>
                    <button
                      onClick={() =>
                        onChange({ min_votes: 50, ordering: "-votes_count" })
                      }
                      className="rounded-lg bg-white px-2 py-1 font-nata-sans-rg text-xs text-blue-700 shadow-sm transition hover:bg-blue-100"
                    >
                      Popular
                    </button>
                    <button
                      onClick={() => onChange({ ordering: "-created_at" })}
                      className="rounded-lg bg-white px-2 py-1 font-nata-sans-rg text-xs text-blue-700 shadow-sm transition hover:bg-blue-100"
                    >
                      Newest
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <span className="text-xs text-gray-500">Active filters:</span>

          {filters.search && (
            <span className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 font-nata-sans-md text-xs font-medium text-violet-700">
              Search: "{filters.search}"
              <button
                onClick={() => onChange({ search: "" })}
                className="ml-1 rounded-full p-0.5 transition hover:bg-violet-200"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.min_score && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-nata-sans-md text-xs font-medium text-amber-700">
              <Star size={12} /> {filters.min_score}+ Stars
              <button
                onClick={() => onChange({ min_score: undefined })}
                className="ml-1 rounded-full p-0.5 transition hover:bg-amber-200"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.min_votes && (
            <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 font-nata-sans-md text-xs font-medium text-blue-700">
              <Users size={12} /> {filters.min_votes}+ Votes
              <button
                onClick={() => onChange({ min_votes: undefined })}
                className="ml-1 rounded-full p-0.5 transition hover:bg-blue-200"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.ordering && (
            <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 font-nata-sans-md text-xs font-medium text-green-700">
              <ArrowUpDown size={12} />
              {filters.ordering === "-votes_score" && "Highest Rating"}
              {filters.ordering === "votes_score" && "Lowest Rating"}
              {filters.ordering === "-votes_count" && "Most Votes"}
              {filters.ordering === "-created_at" && "Newest"}
              <button
                onClick={() => onChange({ ordering: "" })}
                className="ml-1 rounded-full p-0.5 transition hover:bg-green-200"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
