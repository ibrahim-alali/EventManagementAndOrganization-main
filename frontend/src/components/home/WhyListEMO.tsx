import React from "react";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Users } from "lucide-react";

export const WhyListEMO: React.FC = () => {
    return (
        <section className="relative flex min-h-screen w-full items-center bg-white px-6 py-32">

            {/* CONTAINER */}
            <div className="mx-auto max-w-7xl">

                {/* ===== Title ===== */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="mb-16 text-center"
                >
                    <h2 className="font-nata-sans-bd text-3xl text-gray-900 md:text-5xl">
                        Why <span className="text-[#5a2ea6]">List</span><span
                        className="bg-gradient-to-r from-[#5a2ea6] to-[#db2777] bg-clip-text text-transparent">EMO</span>?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl font-nata-sans-rg text-lg text-gray-600">
                        A modern platform that simplifies managing events and venues -
                        <br/>built for organizers, providers, and attendees.
                    </p>
                </motion.div>

                {/* ===== FEATURES ===== */}
                <div className="grid gap-10 md:grid-cols-3">

                    {/* CARD 1: Fast & Smart Search */}
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="rounded-2xl bg-gray-50 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mb-5 inline-flex p-3">
                            <Search className="text-primary h-10 w-10" />
                        </div>
                        <h3 className="mb-3 font-nata-sans-bd text-xl text-gray-900">
                            Fast & Smart Search
                        </h3>
                        <p className="font-nata-sans-rg leading-relaxed text-gray-600">
                            Instantly explore events and venues with powerful filters
                            designed to help users find exactly what they need.
                        </p>
                    </motion.div>

                    {/* CARD 2: Smooth Management */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="rounded-2xl bg-gray-50 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mb-5 inline-flex p-3">
                            <CalendarCheck className="text-primary h-10 w-10" />
                        </div>
                        <h3 className="mb-3 font-nata-sans-bd text-xl text-gray-900">
                            Smooth Management
                        </h3>
                        <p className="font-nata-sans-rg leading-relaxed text-gray-600">
                            Providers and organizers can manage bookings, venues, and events
                            with a seamless and intuitive workflow.
                        </p>
                    </motion.div>

                    {/* CARD 3: Built for Everyone */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="rounded-2xl bg-gray-50 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="mb-5 inline-flex p-3">
                            <Users className="text-primary h-10 w-10" />
                        </div>
                        <h3 className="mb-3 font-nata-sans-bd text-xl text-gray-900">
                            Built for Everyone
                        </h3>
                        <p className="font-nata-sans-rg leading-relaxed text-gray-600">
                            Whether you're an organizer, venue provider, or attendee -
                            ListEMO enhances your experience and keeps everything connected.
                        </p>
                    </motion.div>

                </div>
            </div>

        </section>
    );
};