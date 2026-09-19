import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const VenuesHeader: React.FC = () => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [img1Loaded, setImg1Loaded] = useState(false);
  const [img2Loaded, setImg2Loaded] = useState(false);

  useEffect(() => {
    const bg = new Image();
    bg.src = "/images/gradient_9.webp";
    bg.onload = () => setBgLoaded(true);

    const img1 = new Image();
    img1.src = "/images/hall_4.webp";
    img1.onload = () => setImg1Loaded(true);

    const img2 = new Image();
    img2.src = "/images/hall_1.webp";
    img2.onload = () => setImg2Loaded(true);
  }, []);
  return (
    <header
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden text-center text-white"
      style={{
        backgroundImage: bgLoaded ? "url('/images/gradient_9.webp')" : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.8s ease-out",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black/50" />

      <motion.div
        className="venue-hero-gradient absolute inset-0"
        animate={{ opacity: bgLoaded ? 0 : 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
      />

      {/* ===== Floating Venue Images ===== */}
      <motion.img
        src={img1Loaded ? "/images/hall_4.webp" : undefined}
        alt="venue"
        initial={{
          opacity: 0,
          scale: 0.85,
          x: -140,
          y: "-50%",
          rotate: -8,
          filter: "blur(8px)",
        }}
        animate={{
          opacity: img1Loaded ? 0.9 : 0,
          scale: 1,
          x: 0,
          y: "-50%",
          rotate: -3,
          filter: "blur(3px)",
        }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.8 }}
        className="absolute left-[40px] top-[50%] z-10 h-[320px] w-[480px] rounded-2xl border border-white/30 shadow-2xl"
      />

      <motion.img
        src={img2Loaded ? "/images/hall_1.webp" : undefined}
        alt="venue"
        initial={{
          opacity: 0,
          scale: 0.85,
          x: 140,
          y: "-50%",
          rotate: 8,
          filter: "blur(8px)",
        }}
        animate={{
          opacity: img2Loaded ? 0.9 : 0,
          scale: 1,
          x: 0,
          y: "-50%",
          rotate: 3,
          filter: "blur(3px)",
        }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.8 }}
        className="absolute right-[40px] top-[50%] z-10 h-[320px] w-[480px] rounded-2xl border border-white/30 shadow-2xl"
      />

      {/* ===== Title ===== */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="
          animate-gradient-x
          relative z-10 mb-6
          bg-gradient-to-r from-[#f3e8ff] via-[#cfa3ff] to-[#b07eff]
          bg-clip-text font-nata-sans-eb
          text-4xl tracking-wide text-transparent
          sm:text-7xl sm:leading-tight
        "
      >
        Explore Premium Venues
      </motion.h2>

      {/* ===== Subtitle ===== */}
      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        className="relative z-10 mx-auto max-w-2xl font-nata-sans-md text-lg leading-relaxed text-white/90 sm:text-xl"
      >
        Discover beautiful halls, unique spaces, and perfect locations for your
        events - all in one place, easy to browse and compare.
      </motion.p>
    </header>
  );
};
