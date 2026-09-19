import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export const Header: React.FC = () => {
    const [languageOpen, setLanguageOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState("EN");

    const location = useLocation();
    const currentLink = location.pathname;

    const links = [
        {name: "Home", href: "/"},
        {name: "Events", href: "/events"},
        {name: "Venues", href: "/venues"},
        {name: "Providers", href: "/providers"},
        {name: "Organizers", href: "/organizers"},
    ];

    const languages = [
        {code: "EN", name: "English"},
        {code: "AR", name: "العربية"}
    ];

    const toggleLanguage = () => {
        setLanguageOpen(!languageOpen);
    };

    const selectLanguage = (langCode: string) => {
        setCurrentLanguage(langCode);
        setLanguageOpen(false);
    };

    return (
        <header
            className="fixed left-1/2 top-4 z-50 w-[90%] -translate-x-1/2 rounded-3xl border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl"
        >
            <div className="flex items-center justify-between px-6 py-3 font-nata-sans-md">

                {/* LEFT — LOGO */}
                <div className="flex flex-1 items-center justify-start">
                    <div className="font-nata-sans-bd text-2xl tracking-wide">
                        <span className="text-[#5a2ea6]">List</span>
                        <span
                            className="bg-gradient-to-r from-[#5a2ea6] to-[#db2777] bg-clip-text text-transparent">EMO
                        </span>
                    </div>
                </div>

                {/* CENTER — NAV LINKS */}
                <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`
                                relative transition-all after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full 
                                after:bg-gradient-to-r after:from-[#5a2ea6] after:to-[#db2777] after:transition-all after:duration-300
                                ${currentLink === link.href
                                ? 'text-[#5a2ea6] after:w-full'
                                : 'text-gray-700 hover:text-[#5a2ea6] hover:after:w-full'}
                            `}
                        >
                            {link.name}
                        </Link>

                    ))}
                </nav>

                {/* RIGHT — BUTTONS */}
                <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
                    <Link to="/login">
                        <button
                            className="rounded-xl border border-[#5a2ea6] px-4 py-2 text-sm font-medium
                                       text-[#5a2ea6] transition-all hover:bg-[#5a2ea6] hover:text-white
                                       hover:shadow-md"
                        >
                            Log In
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button
                            className="rounded-xl bg-gradient-to-r from-[#5a2ea6] to-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:from-[#4b2490] hover:to-[#7c3aed] hover:shadow-lg">
                            Sign Up
                        </button>
                    </Link>

                    {/* Language Dropdown */}
                    <div className="relative ml-2">
                        <button
                            className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white/30 px-4 py-2 text-sm text-gray-700 transition-all hover:bg-white/70 hover:shadow-sm"
                            onClick={toggleLanguage}
                        >
                            {currentLanguage}
                            <ChevronDown size={16}
                                         className={`transition-transform ${languageOpen ? 'rotate-180' : ''}`}/>
                        </button>

                        {languageOpen && (
                            <div
                                className="absolute right-0 mt-2 w-28 rounded-lg border border-gray-200 bg-white/90 py-2 text-sm shadow-lg backdrop-blur">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`w-full px-4 py-2 text-left transition-colors ${currentLanguage === lang.code ? 'bg-purple-50 text-[#5a2ea6]' : 'hover:bg-gray-50'}`}
                                        onClick={() => selectLanguage(lang.code)}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};