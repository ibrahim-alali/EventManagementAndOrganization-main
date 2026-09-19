import React from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown } from "lucide-react";

interface RegistrationFilterProps {
  search: string;
  ordering: string;
  onSearchChange: (value: string) => void;
  onOrderingChange: (value: string) => void;
}

export const RegistrationsFilter: React.FC<RegistrationFilterProps> = ({
  search,
  ordering,
  onSearchChange,
  onOrderingChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-2xl border border-gray-100
                 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        
        {/* ===== Search ===== */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4
                             w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search registrations..."
            className="focus:ring-primary/30 w-full rounded-xl border
                       border-gray-200 py-2.5 pl-10
                       pr-4 transition
                       focus:outline-none focus:ring-2"
          />
        </div>

        {/* ===== Ordering ===== */}
        <div className="relative w-full md:w-56">
          <ArrowUpDown className="absolute left-3 top-1/2 h-4
                                  w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={ordering}
            onChange={(e) => onOrderingChange(e.target.value)}
            className="focus:ring-primary/30 w-full appearance-none rounded-xl border
                       border-gray-200 bg-white py-2.5 pl-10
                       pr-4 transition
                       focus:outline-none focus:ring-2"
          >
            <option value="-created_at">Newest first</option>
            <option value="created_at">Oldest first</option>
            <option value="date">Event date (ASC)</option>
            <option value="-date">Event date (DESC)</option>
            <option value="name">Name (A–Z)</option>
            <option value="-name">Name (Z–A)</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};