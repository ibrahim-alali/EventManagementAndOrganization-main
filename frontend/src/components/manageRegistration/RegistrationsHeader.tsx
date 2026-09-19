import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import type { RegistrationsFilterValue } from "../../pages/organizer/RegistrationsManage";

/* =======================
   Types
======================= */

export type StatusOption = {
  value: RegistrationsFilterValue["status"];
  label: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  { value: "all", label: "All registrations" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "canceled", label: "Canceled" },
];

const selectStyles: StylesConfig<StatusOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 8,
    borderColor: state.isFocused ? "#f59e0b" : "#e2e8f0", // amber-500 / slate-200
    boxShadow: state.isFocused ? "0 0 0 2px rgba(245, 158, 11, 0.2)" : "none",
    "&:hover": {
      borderColor: "#cbd5e1", // slate-300
    },
  }),

  menu: (base) => ({
    ...base,
    border: "1px solid #fbbf24",
    borderRadius: 10,
    boxShadow:
      "0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05)",
  }),

  menuList: (base: any) => ({
    ...base,
    padding: 0,
    overflowX: "hidden",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#f59e0b" // amber-500
      : state.isFocused
      ? "#fef3c7" // amber-100
      : "white",
    color: state.isSelected ? "white" : "#0f172a", // slate-900
    fontSize: 14,
    borderRadius: "0.5rem",
    margin: "0.1rem",
    maxWidth: "99%",
    cursor: "pointer",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#334155", // slate-700
    fontSize: 14,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#94a3b8", // slate-400
    fontSize: 14,
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#64748b", // slate-500
    "&:hover": {
      color: "#334155", // slate-700
    },
  }),
};

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  filter: RegistrationsFilterValue;
  onFilterChange: (value: RegistrationsFilterValue) => void;
  onExport: () => void;
};

/* =======================
   Component
======================= */
export const RegistrationsHeader: React.FC<Props> = ({
  title,
  subtitle,
  icon,
  filter,
  onFilterChange,
  onExport,
}) => {
  const selectedOption =
    STATUS_OPTIONS.find((option) => option.value === filter.status) ??
    STATUS_OPTIONS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mb-6 flex items-center justify-between gap-4"
    >
      {/* ---------- Title ---------- */}
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg">
            {icon}
          </div>
        )}

        <div>
          <h1 className="font-nata-sans-md text-xl font-semibold text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="pt-0.5 font-nata-sans-rg text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ---------- Actions ---------- */}
      <div className="flex items-center gap-3">
        <div className="w-52 font-nata-sans-md">
          <Select
            value={selectedOption}
            options={STATUS_OPTIONS}
            styles={selectStyles}
            isSearchable={false}
            onChange={(option: SingleValue<StatusOption>) => {
              if (!option) return;
              onFilterChange({ ...filter, status: option.value });
            }}
          />
        </div>

        {/* Export */}
        <button
          onClick={onExport}
          className="
            inline-flex h-10 items-center gap-2 rounded-lg
            bg-amber-600 px-4 font-nata-sans-md text-sm text-white
            shadow-sm transition hover:bg-amber-500
            focus:outline-none focus:ring-2 focus:ring-amber-500/30
          "
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </motion.div>
  );
};
