import React, { useState } from "react";
import { motion } from "framer-motion";

export const Hero: React.FC = () => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = () => {
    setLoadedCount((c) => c + 1);
  };

  const imagesReady = loadedCount >= 2;

  return (
    <section 
        className="relative flex h-screen w-full items-center overflow-hidden pt-24"
        style={{
            backgroundImage:`url("/images/gradient_2.webp")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}    
        onLoad={() => setBgLoaded(true)}
    >
        
      <motion.div
        className="absolute inset-0"
        style={{
            backgroundImage: "linear-gradient(135deg,#0b1d3a 0%, #3fa9f5 20%,#6b5fb5 45%,#8128d0 70%, #571c8b 100%)",
        }}
        animate={{ opacity: bgLoaded ? 0 : 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
      />

      {/* ===== LEFT CONTENT ===== */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl pt-20 text-white md:pt-0"
        >
          <h1 className="font-nata-sans-bd text-5xl leading-snug drop-shadow-xl md:text-7xl">
            Elevate your event
            <br />
            experience with us
          </h1>

          <p className="mt-6 font-nata-sans-rg text-xl text-gray-200 drop-shadow">
            Connect, learn, and collaborate with leaders, innovators, and
            creators from around the world - all gathered in one unforgettable
            conference.
          </p>
        </motion.div>
      </div>

      {/* ===== RIGHT IMAGES ===== */}
      <motion.div
        initial={{ opacity: 0, x: 70 }}
        whileInView={imagesReady ? { opacity: 1, x: 0 } : { opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute right-6 z-10 -translate-y-1/2 md:right-24"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={imagesReady ? { opacity: 1 } : {}}
          transition={{ duration: 0.2 }}
          className="h-full w-full"
        >
          <div className="relative h-[480px] w-[420px] md:h-[580px] md:w-[520px]">
            {/* الصورة الأولى */}
            <div
              className="absolute left-0 top-0 h-56 w-72 rotate-[-4deg] overflow-hidden
                        rounded-2xl shadow-2xl md:h-72 md:w-96"
            >
              <img
                src="/images/event_1.webp"
                alt="event"
                loading="eager"
                fetchPriority="high"
                onLoad={handleImageLoad}
                className="h-full w-full object-cover"
              />
            </div>

            {/* الصورة الثانية (تحت وداخل) */}
            <div
              className="absolute bottom-0 right-0 h-56 w-72 rotate-[4deg] overflow-hidden
                        rounded-2xl shadow-2xl md:h-72 md:w-96"
            >
              <img
                src="/images/hall_3.webp"
                alt="hall"
                loading="eager"
                fetchPriority="low"
                onLoad={handleImageLoad}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
