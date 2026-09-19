import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

type RatingFilterProps = {
    search: string;
    setSearch: (value: string) => void;
    sort: "latest" | "highest" | "lowest";
    setSort: (value: "latest" | "highest" | "lowest") => void;
};

export const RatingFilter: React.FC<RatingFilterProps> = ({
  search,
  setSearch,
  sort,
  setSort,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const sortOptions: { label: string; value: "latest" | "highest" | "lowest" }[] = [
        {label: "Latest", value: "latest"},
        {label: "Highest Rating", value: "highest"},
        {label: "Lowest Rating", value: "lowest"},
    ];

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* ===== Search ===== */}
            <div className="relative flex w-full items-center sm:w-1/2">
                <Search className="absolute left-3 h-5 w-5 text-gray-400"/>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-violet-300 bg-violet-100/50
                     py-2 pl-10 pr-4 font-nata-sans-rg text-sm text-violet-900 placeholder-gray-400
                     transition hover:bg-violet-50/50 focus:outline-none"
                />
            </div>

            {/* ===== Sort Dropdown ===== */}
            <div className="relative w-48">
                <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-xl
                               border border-violet-300 bg-violet-100/50 px-4
                               py-2 font-nata-sans-md text-sm text-violet-900
                               shadow-sm transition hover:bg-violet-50/50"
                >
                    {sortOptions.find((opt) => opt.value === sort)?.label || "Sort"}
                    {dropdownOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500"/>
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500"/>
                    )}
                </button>

                <AnimatePresence>
                    {dropdownOpen && (
                        <motion.div
                            initial={{opacity: 0, y: -5}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -5}}
                            transition={{duration: 0.2}}
                            className="absolute z-50 mt-1 w-full overflow-hidden
                                       rounded-xl border border-violet-300 
                                       bg-white shadow-lg"
                        >
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSort(option.value);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left font-nata-sans-md text-sm transition
                                                hover:bg-[#5a2ea6]/10 dark:hover:bg-[#5a2ea6]/20 ${
                                                    sort === option.value ? "font-nata-sans-bd" : ""
                                    }           `}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
