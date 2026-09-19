import React from "react";
import { motion } from "framer-motion";
import { Users, Building2, CalendarDays } from "lucide-react";

export const ForWho: React.FC = () => {
    return (
        <section className="flex min-h-screen w-full items-center bg-white bg-gradient-to-br from-white via-[#fdf2f8] to-[#f0f9ff] px-6 py-32">
            <div className="mx-auto max-w-7xl">

                {/* ===== Title ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h2 className="font-nata-sans-bd text-3xl text-gray-900 md:text-5xl">
                        For <span className="text-primary">Who?</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl font-nata-sans-rg text-lg text-gray-600">
                        A unified platform tailored for every party involved in the events ecosystem.
                    </p>
                </motion.div>

                {/* ===== GRID CARDS ===== */}
                <div className="grid gap-10 md:grid-cols-3">

                    <WhoCard
                        title="Venue Providers"
                        icon={<Building2 className="text-primary h-10 w-10" />}
                        items={[
                            "Manage venues & bookings",
                            "Control prices & schedules",
                            "View reservations & statistics",
                        ]}
                        delay={0.2}
                    />

                    <WhoCard
                        title="Organizers"
                        icon={<CalendarDays className="text-primary h-10 w-10" />}
                        items={[
                            "Create & manage events",
                            "Handle tickets & registrations",
                            "Send invitations & updates",
                        ]}
                        delay={0.3}
                    />

                    <WhoCard
                        title="Attendees"
                        icon={<Users className="text-primary h-10 w-10" />}
                        items={[
                            "Browse venues & events",
                            "Register & book instantly",
                            "Rate events & venues",
                        ]}
                        delay={0.4}
                    />

                </div>
            </div>
        </section>
    );
};

interface FeatureCardState {
    title: string;
    icon: React.ReactNode;
    items: string[];
    delay: number;
}

const WhoCard: React.FC<FeatureCardState> = ({ title, icon, items, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay }}
            className="rounded-2xl border border-gray-200 bg-[#fafafa] p-8 shadow-sm
                       transition-all hover:border-gray-300 hover:shadow-lg"
        >
            <div className="mb-5">{icon}</div>

            <h3 className="mb-4 font-nata-sans-bd text-2xl text-gray-900">
                {title}
            </h3>

            <ul className="space-y-2 font-nata-sans-rg text-gray-600">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className="text-primary text-lg leading-snug">•</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};