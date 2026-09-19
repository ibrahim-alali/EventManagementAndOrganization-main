import React from "react";
import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";

interface GuestHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const GuestHeader: React.FC<GuestHeaderProps> = ({ title, description, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      {/* ===== Left: Title & Description ===== */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl">
          <UserCheck className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-nata-sans-rg text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>

          {description && (
            <p className="mt-1 max-w-xl font-nata-sans-rg text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {/* ===== Right: Actions ===== */}
      {actions && <div className="flex items-center gap-3 self-start md:self-auto">{actions}</div>}
    </motion.div>
  );
};
