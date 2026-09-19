import React from "react";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: "amber" | "blue" | "violet" | "emerald";
  isLoading?: boolean;
}

const accentStyles = {
  amber: {
    glow: "bg-amber-200/40",
    iconBg: "bg-amber-100",
    iconBorder: "border-amber-200",
    iconText: "text-amber-700",
  },
  blue: {
    glow: "bg-blue-200/40",
    iconBg: "bg-blue-100",
    iconBorder: "border-blue-200",
    iconText: "text-blue-700",
  },
  violet: {
    glow: "bg-violet-200/60",
    iconBg: "bg-violet-100",
    iconBorder: "border-violet-200",
    iconText: "text-violet-700",
  },
  emerald: {
    glow: "bg-emerald-200/40",
    iconBg: "bg-emerald-100",
    iconBorder: "border-emerald-200",
    iconText: "text-emerald-700",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  accent = "amber",
  isLoading,
}) => {
  const styles = accentStyles[accent];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="
        relative overflow-hidden
        rounded-2xl border border-slate-200
        bg-white p-5 shadow-sm
      "
    >
      <div
        className={`
            absolute -right-12 -top-12 h-32 w-32
            rounded-full blur-3xl
            ${styles.glow}
        `}
      />

      <div className="relative flex items-center justify-between">
        {/* Left */}
        <div>
          <p
            className="
              font-nata-sans-md text-xs uppercase
              tracking-wider text-slate-600
            "
          >
            {label}
          </p>

          <div
            className="
              mt-2 font-nata-sans-bd
              text-2xl text-slate-900
            "
          >
            {isLoading ? "—" : value}
          </div>
        </div>

        {/* Icon */}
        <div
          className={`
                flex h-11 w-11 items-center justify-center
                rounded-xl border
                ${styles.iconBg}
                ${styles.iconBorder}
                ${styles.iconText}
            `}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
};
