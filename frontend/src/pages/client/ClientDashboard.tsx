import React from "react";
import { motion, type Variants } from "framer-motion";

// Dashboard Components
import { Stats } from "../../components/dashboard/client/Stats";
import { QuickActions } from "../../components/dashboard/client/QuickActions";
import { RecentActivity } from "../../components/dashboard/client/RecentActivity";

const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.97,
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.45,
            ease: "easeOut",
        },
    },
};

export const ClientDashboard: React.FC = () => {
    return (
        <div className="w-full">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <motion.div variants={itemVariants}>
                    <Stats/>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <QuickActions/>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <RecentActivity/>
                </motion.div>
            </motion.div>
        </div>
    );
};
