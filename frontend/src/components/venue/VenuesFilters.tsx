import React from "react";
import { motion } from "framer-motion";
import { Search, Users, DollarSign, ChevronDown } from "lucide-react";

interface VenuesFiltersProps {
    filters: {
        search: string;
        min_capacity?: number;
        max_capacity?: number;
        min_price?: number;
        max_price?: number;
        ordering: string;
    };
    onChange: (
        newFilters: Partial<{
            search: string;
            min_capacity?: number;
            max_capacity?: number;
            min_price?: number;
            max_price?: number;
            ordering: string;
        }>
    ) => void;
}

export const VenuesFilters: React.FC<VenuesFiltersProps> = ({ filters, onChange }) => {
    return (
        <motion.div
            className="mx-auto my-5 w-full max-w-5xl rounded-3xl bg-white p-5 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
        >
            {/* Search - Full width on top */}
            <div className="relative mb-4 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => onChange({ search: e.target.value })}
                    placeholder="Search venues..."
                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 font-nata-sans-rg text-sm transition-all focus:border-[#5a2ea6]"
                />
            </div>

            {/* Grid for the rest of filters */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {/* Min Capacity */}
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="number"
                        min={0}
                        value={filters.min_capacity ?? ""}
                        onChange={(e) =>
                            onChange({ min_capacity: e.target.value ? Number(e.target.value) : undefined })
                        }
                        placeholder="Min capacity"
                        className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 font-nata-sans-rg text-sm transition focus:border-[#5a2ea6]"
                    />
                </div>

                {/* Max Capacity */}
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="number"
                        min={0}
                        value={filters.max_capacity ?? ""}
                        onChange={(e) =>
                            onChange({ max_capacity: e.target.value ? Number(e.target.value) : undefined })
                        }
                        placeholder="Max capacity"
                        className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 font-nata-sans-rg text-sm transition focus:border-[#5a2ea6]"
                    />
                </div>

                {/* Min Price */}
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="number"
                        min={0}
                        value={filters.min_price ?? ""}
                        onChange={(e) =>
                            onChange({ min_price: e.target.value ? Number(e.target.value) : undefined })
                        }
                        placeholder="Min price / hr"
                        className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 font-nata-sans-rg text-sm transition focus:border-[#5a2ea6]"
                    />
                </div>

                {/* Max Price */}
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="number"
                        min={0}
                        value={filters.max_price ?? ""}
                        onChange={(e) =>
                            onChange({ max_price: e.target.value ? Number(e.target.value) : undefined })
                        }
                        placeholder="Max price / hr"
                        className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 font-nata-sans-rg text-sm transition focus:border-[#5a2ea6]"
                    />
                </div>

                {/* Ordering */}
                <div className="relative w-full sm:w-48">
                    <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <select
                        value={filters.ordering}
                        onChange={(e) => onChange({ ordering: e.target.value })}
                        className="w-full appearance-none rounded-xl border border-gray-300 px-6 py-2.5 font-nata-sans-rg text-sm transition focus:border-[#5a2ea6]"
                    >
                        <option value="">Sort by</option>
                        <option value="capacity">Capacity ↑</option>
                        <option value="-capacity">Capacity ↓</option>
                        <option value="price_per_hour">Price ↑</option>
                        <option value="-price_per_hour">Price ↓</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
};
