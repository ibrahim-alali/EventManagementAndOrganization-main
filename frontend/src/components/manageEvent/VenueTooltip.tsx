import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, DollarSign, Info } from "lucide-react";

interface VenueTooltipProps {
  venue: {
    id: string;
    name: string;
    description?: string;
    capacity?: number;
    price_per_hour?: string;
    location_geo?: {
      location: string;
      area: string;
      city: string;
    };
  };
  portalContainer: HTMLElement | null;
}

export const VenueTooltip: React.FC<VenueTooltipProps> = ({
  venue,
  portalContainer,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!portalContainer) return; 
    const rect = e.currentTarget.getBoundingClientRect();

    const containerScrollTop = portalContainer.scrollTop || 0;
    const containerRect = portalContainer.getBoundingClientRect();

    setCoords({
      x: rect.left + rect.width / 2 - containerRect.left, 
      y: rect.bottom - containerRect.top + containerScrollTop + 8,
    });

    setVisible(true);
  };

  const handleMouseLeave = () => setVisible(false);

  const [lat, lng] = venue.location_geo?.location.split(",") || ["0", "0"];

  if (!portalContainer) return null;

  return (
    <>
      <span
        className="flex cursor-pointer items-center justify-center gap-1 font-nata-sans-md text-gray-800"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Info size={14} className="mt-0.5" />
        {venue.name}
      </span>

      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              style={{
                top: coords.y,
                left: coords.x,
                transform: "translateX(-50%)",
              }}
              className="absolute z-50 w-72 max-w-xs rounded-xl border border-gray-200 bg-white p-4 font-nata-sans-rg text-gray-700 shadow-xl"
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={handleMouseLeave}
            >
              <p className="mb-2 flex items-center gap-1 font-nata-sans-bd text-amber-600">
                <MapPin size={16} /> {venue.name}
              </p>
              <p className="mb-2 text-sm">{venue.description}</p>
              <div className="mb-2 flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Users size={14} /> {venue.capacity}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={14} /> {venue.price_per_hour}
                </span>
              </div>
              <p className="mb-2 text-sm">
                <span className="font-nata-sans-bd">Area:</span>{" "}
                {venue.location_geo?.area}, {venue.location_geo?.city}
              </p>
              <div className="h-36 w-full overflow-hidden rounded-md border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="pointer-events-auto"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                  title="Venue location"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        portalContainer
      )}
    </>
  );
};
