import React from "react";
import {motion} from "framer-motion";
import {
    CalendarCheck,
    Building2,
    Star,
    Search,
    UserCog,
    MapPin,
    Bell
} from "lucide-react";

export const CoreFeatures: React.FC = () => {
    return (
        <section
            className="relative flex min-h-screen w-full items-center bg-gradient-to-br from-[#dbeafe] via-[#e9d5ff] to-[#a5f3fc] px-6 py-32"
        >
            <div className="mx-auto max-w-7xl">

                {/* ===== Title ===== */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="mb-16 text-center"
                >
                    <h2 className="font-nata-sans-bd text-3xl text-gray-900 md:text-5xl ">
                        Core Features
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl font-nata-sans-rg text-lg text-gray-600">
                        A powerful suite of tools that covers everything needed
                        to run and discover events with ease.
                    </p>
                </motion.div>

                {/* ===== GRID ===== */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

                    <FeatureCard
                        title="Event & Venue Management"
                        icon={<Building2 className="text-primary h-10 w-10"/>}
                        desc="Create, manage, edit, archive, and control events and venues with advanced workflows."
                        delay={0.2}
                    />

                    <FeatureCard
                        title="Bookings & Registrations"
                        icon={<CalendarCheck className="text-primary h-10 w-10"/>}
                        desc="Approve, reject, cancel bookings, and manage event registrations smoothly."
                        delay={0.3}
                    />

                    <FeatureCard
                        title="Ratings & Reviews"
                        icon={<Star className="text-primary h-10 w-10"/>}
                        desc="Users can leave ratings and reviews for venues and events to guide others."
                        delay={0.4}
                    />

                    <FeatureCard
                        title="Smart Search & Filters"
                        icon={<Search className="text-primary h-10 w-10"/>}
                        desc="Unified search for events and venues with advanced filtering options."
                        delay={0.5}
                    />

                    <FeatureCard
                        title="User Account & Security"
                        icon={<UserCog className="text-primary h-10 w-10"/>}
                        desc="Manage account details, update passwords, and keep user data secure."
                        delay={0.6}
                    />

                    <FeatureCard
                        title="Maps & Notifications"
                        icon={
                            <div className="flex items-center gap-3">
                                <MapPin className="text-primary h-8 w-8"/>
                                <Bell className="text-primary h-8 w-8"/>
                            </div>
                        }
                        desc="View event and venue locations on the map and get important updates instantly."
                        delay={0.7}
                    />

                </div>
            </div>
        </section>
    );
};

interface FeatureCardProps {
    title: string;
    icon: React.ReactNode;
    desc: string;
    delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, desc, delay }) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay}}
            className="min-h-[250px] rounded-2xl border border-gray-100 bg-white
                       p-8 shadow-lg transition-shadow
                       hover:shadow-xl"
        >
            <div className="mb-5">{icon}</div>

            <h3 className="mb-3 font-nata-sans-bd text-xl text-gray-900">
                {title}
            </h3>

            <p className="font-nata-sans-rg leading-relaxed text-gray-600">
                {desc}
            </p>
        </motion.div>
    );
};