import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
export const CallToAction: React.FC = () => {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/images/gradient_4.webp";
    img.onload = () => setBgLoaded(true);
  }, []);

  return (
    <motion.section
      className="relative flex min-h-screen w-full select-none items-center overflow-hidden px-6 py-36"
      style={{
        backgroundImage: bgLoaded ? "url('/images/gradient_4.webp')" : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-out",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      {/* ===== Content ===== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative mx-auto max-w-4xl text-center text-white"
      >
        <h2 className="mb-8 font-nata-sans-bd text-5xl font-extrabold leading-tight tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.45)] md:text-6xl">
          Manage Your Events & Venues
          <span className="mt-2 block font-nata-sans-rg text-purple-400">
            Smarter. Faster. Easier.
          </span>
        </h2>

        <p className="mx-auto mb-10 max-w-2xl font-nata-sans-rg text-lg leading-relaxed text-white/85 md:text-xl">
          A modern platform that helps you streamline bookings, organize events,
          and deliver flawless attendee experiences-without the chaos.
        </p>

        {/* ===== Buttons ===== */}
        <div className="mt-6 flex flex-col items-center justify-center gap-6 font-nata-sans-md sm:flex-row">
          {/* Create Account */}
          <Link
            to="/signup"
            className="flex items-center gap-2 rounded-xl bg-[#A855F7]
                        px-10 py-4 text-lg font-semibold shadow-xl backdrop-blur-sm
                        transition-all hover:bg-[#9333EA] hover:shadow-[0_0_25px_rgba(168,85,247,0.45)]"
          >
            Create Account
            <ArrowRight size={20} />
          </Link>

          {/* Explore Events */}
          <Link
            to="/events"
            className="flex items-center gap-2 rounded-xl bg-white/90
                        px-10 py-4 text-lg font-semibold text-[#3A0A57] shadow-lg
                        backdrop-blur-sm transition-all hover:bg-white hover:shadow-2xl"
          >
            Explore Events
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
};
