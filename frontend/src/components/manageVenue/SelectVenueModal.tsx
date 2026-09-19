import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import { X, MapPin } from "lucide-react";

import { useVenuesQuery } from "../../hooks/useVenuesManage";

interface SelectVenueModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (venue: { id: string; name: string }) => void;
}

interface VenueOption {
  value: string;
  label: string;
}

export const SelectVenueModal: React.FC<SelectVenueModalProps> = ({ open, onClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState<VenueOption | null>(null);

  const { data: venues = [], isLoading } = useVenuesQuery({
    search,
  });

  const options: VenueOption[] = useMemo(
    () =>
      venues.map((venue) => ({
        value: venue.id,
        label: venue.name,
      })),
    [venues]
  );

  const handleConfirm = () => {
    if (!selectedOption) return;

    onSelect({
      id: selectedOption.value,
      name: selectedOption.label,
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
          {/* ===== Header ===== */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-nata-sans-bd text-lg text-gray-800">Select Venue</h3>
              </div>
              <p className="font-nata-sans-rg text-sm text-gray-500">
                Choose a venue before uploading files
              </p>
            </div>
              <button
                onClick={onClose}
                className="mb-6 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
          </div>

          {/* ===== Select ===== */}
          <div className="mb-6 font-nata-sans-md text-[15px]">
            <Select
              options={options}
              value={selectedOption}
              onChange={(option) => setSelectedOption(option)}
              onInputChange={(value) => setSearch(value)}
              isLoading={isLoading}
              placeholder="Search venue by name..."
              classNamePrefix="venue-select"
              noOptionsMessage={() => (isLoading ? "Loading venues..." : "No venues found")}
              styles={{
                control: (base: any, state: any) => ({
                  ...base,
                  borderRadius: "0.75rem",
                  borderColor: state.isFocused ? "#6ee7b7" : "#d1d5db", // amber-400 / gray-300
                  boxShadow: state.isFocused ? "0 0 0 2px #34d399" : "none",
                  overflow: "hidden",
                  marginTop: "4px",
                  "&:hover": {
                    borderColor: "#34d399",
                  },
                }),
                valueContainer: (base: any) => ({
                  ...base,
                  padding: "0 0.75rem", // px-3
                }),

                input: (base: any) => ({
                  ...base,
                  margin: 0,
                  padding: 0,
                }),

                indicatorsContainer: (base: any) => ({
                  ...base,
                  paddingRight: "0.5rem",
                }),

                menu: (base: any) => ({
                  ...base,
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }),

                menuList: (base: any) => ({
                  ...base,
                  padding: 0,
                  overflowX: "hidden",
                }),
                option: (base, state) => ({
                  ...base,
                  padding: "0.5rem 0.75rem",
                  backgroundColor: state.isSelected
                    ? "#10b981"
                    : state.isFocused
                      ? "#ecfdf5"
                      : "white",
                  color: state.isSelected ? "white" : "#374151",
                  cursor: "pointer",
                  ":active": {
                    backgroundColor: state.isSelected ? "#10b981" : "#a7f3d0",
                  },
                }),
              }}
            />
          </div>

          {/* ===== Footer ===== */}
          <div className="flex items-center justify-between">
            {selectedOption ? (
              <div className="flex items-center gap-1 font-nata-sans-md text-sm text-emerald-600">
                <MapPin className="h-4 w-4" />
                {selectedOption.label}
              </div>
            ) : (
              <span className="font-nata-sans-rg text-sm text-gray-400">No venue selected</span>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 font-nata-sans-md text-sm text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                disabled={!selectedOption}
                onClick={handleConfirm}
                className="rounded-xl bg-emerald-600 px-4 py-2 font-nata-sans-md text-sm text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
