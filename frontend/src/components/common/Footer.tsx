import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
    const location = useLocation();

    const links = [
        { name: "Home", href: "/" },
        { name: "Events", href: "/events" },
        { name: "Venues", href: "/venues" },
        { name: "Providers", href: "/providers" },
        { name: "Organizers", href: "/organizers" },
    ];

    return (
        <footer className="w-full border-t border-black/5 bg-gradient-to-br from-[#f9f7ff] via-[#efe8ff] to-[#e9f6ff] px-8 py-10 text-black ">

            {/* ===== Container centered ===== */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 sm:grid-cols-2 md:grid-cols-4">

                {/* ===== Column 1: Logo / About ===== */}
                <div className="flex flex-col">
                    <h2 className="font-nata-sans-bd text-3xl text-[#6D28D9]">
                        <span className="text-[#5a2ea6]">List</span>
                        <span className="bg-gradient-to-r from-[#5a2ea6] to-[#db2777] bg-clip-text text-transparent">
                            EMO
                        </span>
                    </h2>
                    <p className="mt-3 text-balance break-words font-nata-sans-rg text-sm leading-relaxed text-black/70">
                        A smart platform that simplifies managing events,
                        organizing venues, and handling bookings with ease.
                    </p>
                </div>

                {/* ===== Column 2: Navigation Links ===== */}
                <div className="flex flex-col items-center md:ml-14">
                    <h4 className="mb-4 font-nata-sans-md text-lg text-[#6D28D9]">
                        Navigation
                    </h4>
                    <ul className="space-y-3 text-center font-nata-sans-rg text-black/70">
                        {links.map(link => (
                            <li key={link.name}>
                                <Link
                                    to={link.href}
                                    className={`
                                        relative transition-colors duration-300
                                        ${location.pathname === link.href
                                        ? 'text-[#7c3aed] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-[#5a2ea6] after:to-[#db2777]'
                                        : 'group text-black/70 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#5a2ea6] after:to-[#db2777] after:transition-all hover:text-[#7c3aed] hover:after:w-full'
                                    }
                            `}
                                >
                                    <span className="transition-colors duration-300">{link.name}</span>
                                    <span
                                        className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#5a2ea6] to-[#db2777] transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ===== Column 3: Roles / Sign Up ===== */}
                <div className="flex flex-col items-center md:ml-14">
                    <h4 className="mb-4 font-nata-sans-md text-lg text-[#6D28D9]">
                        Join As
                    </h4>
                    <ul className="space-y-3 text-center font-nata-sans-rg text-black/70">
                        <li>
                            <Link to="/signup/provider" className="group relative">
                                <span className="transition-colors duration-300 group-hover:text-[#7c3aed]">Venue Provider</span>
                                <span
                                    className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#5a2ea6] to-[#db2777] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/signup/organizer" className="group relative">
                                <span className="transition-colors duration-300 group-hover:text-[#7c3aed]">Event Organizer</span>
                                <span
                                    className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#5a2ea6] to-[#db2777] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </ul>

                    {/* ===== Technical Support Section ===== */}
                    <div className="mt-10 text-center">
                        <h4 className="mb-4 font-nata-sans-md text-lg text-[#6D28D9]">Support</h4>
                        <Link
                            to="/support"
                            className="group relative"
                        >
                            <span
                                className="transition-colors duration-300 group-hover:text-[#7c3aed]">Technical Support</span>
                            <span
                                className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#5a2ea6] to-[#db2777] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                </div>

                {/* ===== Column 4: Social Media ===== */}
                <div className="flex flex-col items-center md:ml-14">
                    <h4 className="mb-4 font-nata-sans-md text-lg text-[#6D28D9]">
                        Follow Us
                    </h4>
                    <div className="flex gap-4">
                        <a href="#" className="transform text-black/70 transition duration-300 hover:scale-110 hover:text-[#7c3aed]">
                            <Facebook size={22} />
                        </a>
                        <a href="#" className="transform text-black/70 transition duration-300 hover:scale-110 hover:text-[#7c3aed]">
                            <Instagram size={22} />
                        </a>
                        <a href="#" className="transform text-black/70 transition duration-300 hover:scale-110 hover:text-[#7c3aed]">
                            <Twitter size={22} />
                        </a>
                        <a href="#" className="transform text-black/70 transition duration-300 hover:scale-110 hover:text-[#7c3aed]">
                            <Linkedin size={22} />
                        </a>
                    </div>
                </div>
            </div>

            {/* ===== Divider ===== */}
            <div className="mx-auto mt-10 max-w-6xl border-t border-black/10 pt-6 text-center">
                <p className="font-nata-sans-rg text-sm text-black/60">
                    © 2025 ListEMO - All Rights Reserved.
                </p>
            </div>

        </footer>
    );
};
