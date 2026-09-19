import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  subtitle: string;
}

interface WizardHeaderProps {
  step: number; // current step (1-3)
}

const steps: Step[] = [
  { id: 1, title: "Create Event", subtitle: "Event details" },
  { id: 2, title: "Select Booking", subtitle: "Choose venue" },
  { id: 3, title: "Confirmation", subtitle: "Review & confirm" },
];

export const WizardHeader: React.FC<WizardHeaderProps> = ({ step }) => {
  return (
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;

            return (
                <React.Fragment key={s.id}>
                  <div className="relative z-10 flex items-center gap-3">
                    <motion.div
                        layout
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-nata-sans-eb text-white ${
                            isCompleted
                                ? "bg-emerald-500 text-white"
                                : isActive
                                    ? "bg-amber-400 text-white ring-4 ring-amber-100"
                                    : "bg-slate-200 text-slate-500"
                        }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : s.id}
                    </motion.div>

                    <div className="hidden sm:block">
                      <p
                          className={`${
                              isActive
                                  ? "font-nata-sans-bd text-gray-800"
                                  : "font-nata-sans-md text-gray-500"
                          }`}
                      >
                        {s.title}
                      </p>
                      <p className="font-nata-sans-rg text-xs text-gray-400">
                        {s.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar between steps */}
                  {idx < steps.length - 1 && (
                      <div className="relative mx-4 h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <motion.div
                            layout
                            initial={{ width: 0 }}
                            animate={{ width: step > s.id ? "100%" : "0%" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="h-full bg-amber-400"
                        />
                      </div>
                  )}
                </React.Fragment>
            );
          })}
        </div>
      </div>
  );
};
