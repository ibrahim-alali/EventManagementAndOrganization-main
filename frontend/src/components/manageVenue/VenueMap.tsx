import React from "react";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L, { type LatLngBoundsExpression } from "leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import { Pin } from "lucide-react";

/* =======================
   Fix Leaflet Icons
======================= */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* =======================
   Syria Config
======================= */

const SYRIA_BOUNDS: LatLngBoundsExpression = [
  [32.0, 35.5],
  [37.5, 42.5],
];

const GOVERNORATES = [
  { name: "Damascus", coords: [33.514, 36.277] },
  { name: "Rif Dimashq", coords: [33.6, 36.3] },
  { name: "Aleppo", coords: [36.202, 37.134] },
  { name: "Homs", coords: [34.733, 36.716] },
  { name: "Hama", coords: [35.131, 36.757] },
  { name: "Latakia", coords: [35.523, 35.792] },
  { name: "Tartous", coords: [34.889, 35.886] },
  { name: "Idlib", coords: [35.93, 36.63] },
  { name: "Daraa", coords: [32.618, 36.102] },
  { name: "As-Suwayda", coords: [32.708, 36.566] },
  { name: "Deir ez-Zor", coords: [35.333, 40.15] },
  { name: "Raqqa", coords: [35.95, 39.01] },
  { name: "Hasakah", coords: [36.5, 40.75] },
] as const;

/* =======================
   Props
======================= */

interface VenueMapProps {
  value?: string; // "lat,lng"
  onChange: (coords: string) => void;
}

/* =======================
   Helpers
======================= */

const parseCoords = (value?: string): [number, number] => {
  if (!value) return [33.514, 36.277]; // Damascus default
  const [lat, lng] = value.split(",").map(Number);
  return [lat, lng];
};

/* =======================
   Internal Components
======================= */

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

/* =======================
   Component
======================= */

export const VenueMap: React.FC<VenueMapProps> = ({ value, onChange }) => {
  const initialPosition = useMemo(() => parseCoords(value), [value]);

  const [markerPosition, setMarkerPosition] =
    useState<[number, number]>(initialPosition);

  const [selectedGov, setSelectedGov] = useState<string>(GOVERNORATES[0].name);

  useEffect(() => {
    setMarkerPosition(initialPosition);
  }, [initialPosition]);

  /* ---------- Marker Drag ---------- */
  const handleDragEnd = (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    const coords = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    setMarkerPosition([lat, lng]);
    onChange(coords);
  };

  /* ---------- Governorate Change ---------- */
  const handleGovernorateChange = (name: string) => {
    const gov = GOVERNORATES.find((g) => g.name === name);
    if (!gov) return;

    setSelectedGov(name);
    setMarkerPosition(gov.coords as [number, number]);
    onChange(`${gov.coords[0]},${gov.coords[1]}`);
  };

  return (
    <motion.div
      className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* ---------- Header / Controls ---------- */}
      <div className="flex items-center gap-3 border-b bg-gray-50 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Pin />
        </div>

        <div className="flex-1">
          <p className="font-nata-sans-bd text-sm text-gray-800">
            Venue Location
          </p>
          <p className="text-xs text-gray-500">
            Select governorate & drag the pin
          </p>
        </div>

        <select
          value={selectedGov}
          onChange={(e) => handleGovernorateChange(e.target.value)}
          className="
        rounded-xl border border-gray-300 bg-white px-3 py-2 font-nata-sans-rg
        text-sm shadow-sm
        outline-none focus:border-emerald-500 focus:ring-1
        focus:ring-emerald-200
      "
        >
          {GOVERNORATES.map((gov) => (
            <option key={gov.name} value={gov.name}>
              {gov.name}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- Map ---------- */}
      <div className="relative">
        <MapContainer
          center={markerPosition}
          zoom={11}
          zoomControl={false}
          minZoom={6}
          maxBounds={SYRIA_BOUNDS}
          maxBoundsViscosity={1.0}
          style={{ height: 380, width: "100%" }}
          className="z-0"
        >
          <ChangeView center={markerPosition} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={markerPosition}
            draggable
            eventHandlers={{
              dragend: handleDragEnd,
            }}
          />
        </MapContainer>

        {/* ---------- Overlay Hint ---------- */}
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur">
          Drag the marker to adjust location
        </div>
      </div>
    </motion.div>
  );
};
