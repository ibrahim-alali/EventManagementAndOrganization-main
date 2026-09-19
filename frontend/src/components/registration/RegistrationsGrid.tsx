import React from "react";
import { motion } from "framer-motion";

import { RegistrationCard } from "./RegistrationCard";
import type { Registration } from "../../api/registrations";


interface RegistrationsGridProps {
  registrations: Registration[];
  onSelect?: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export const RegistrationsGrid: React.FC<RegistrationsGridProps> = ({ registrations, onSelect }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1
                 gap-6
                 sm:grid-cols-2
                 lg:grid-cols-3
                 xl:grid-cols-4"
    >
      {registrations.map((registration) => (
        <motion.div
          key={registration.id}
          variants={itemVariants}
        >
          <RegistrationCard registration={registration} onSelect={onSelect} />
        </motion.div>
      ))}
    </motion.div>
  );
};