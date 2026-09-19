import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../../hooks/useEvent";
import { useCreateRegistration } from "../../hooks/useRegistrations";
import { useOutletContext } from "react-router-dom";

import { getToken } from "../../utils/authToken";
import { getRole } from "../../utils/authRole";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Users,
  Phone,
  Notebook,
  Heart,
  LogIn,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { RatingsSection } from "../rating/RatingsSection";
import { StarRating } from "../rating/StarRating";
import { EventsRecommendations } from "./EventsRecommendations";

import type { EventDetails } from "../../api/events";

interface EventCardDetailsProps {
  event: EventDetails;
  onBack: () => void;
}

interface LayoutContextType {
  scrollableNodeRef: React.RefObject<HTMLElement>;
}

export const EventCardDetails: React.FC<EventCardDetailsProps> = ({ event, onBack }) => {
  const { scrollableNodeRef } = useOutletContext<LayoutContextType>();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { data: eventData } = useEvent(selectedEventId ?? event.id);
  const currentEvent = eventData ?? event;

  const createMutation = useCreateRegistration();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedEventId) return;

    const node = scrollableNodeRef?.current;
    if (node) {
      node.scrollTo({
        top: 700,
        behavior: "smooth",
      });
    }
  }, [selectedEventId, scrollableNodeRef]);
  
  const coverImage =
    currentEvent.venue.images.find((img) => img.is_cover) ?? currentEvent.venue.images[0];

  const accessToken = getToken();
  const role = getRole();

  const isLoggedIn = Boolean(accessToken);
  const isClient = role === "client";

  const isRegistered = currentEvent.is_registered;


  const handleRegister = () => {
    if (!isLoggedIn) {
      toast.error("Please login to register for this event");
      return;
    }

    if (!isClient) {
      toast.error("Only clients can register for events");
      return;
    }

    createMutation.mutate(
      { event: currentEvent.id },
      {
        onSuccess: () => {
          toast.success("Successfully registered for the event!");
          setTimeout(() => {
            navigate("/client/registrations");
          }, 1000);
        },
        onError: (error) => {
          toast.error("Failed to register. Please try again.");
          console.error("Registration Error:", error);
        },
      }
    );
  };

  const handleSelectRecommendation = (id: string) => {
    setSelectedEventId(id);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto mb-8 w-full max-w-5xl rounded-3xl bg-white p-8 shadow-xl"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 font-nata-sans-md text-sm text-[#5a2ea6] hover:text-purple-700"
      >
        <ArrowLeft size={18} className="transition hover:translate-x-1" />
        Back to events
      </button>

      {/* Cover Image */}
      {coverImage && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={coverImage.image_url}
            alt={coverImage.alt_text}
            className="h-[320px] w-full object-cover"
          />
        </div>
      )}

      {/* Organizer */}
      <div className="mb-6 rounded-2xl bg-[#f6f1ff] p-5">
        <h3 className="mb-3 font-nata-sans-bd text-lg text-[#5a2ea6]">Organizer</h3>

        <div className="flex flex-wrap gap-8 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>Name: {currentEvent.organizer.full_name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>Email: {currentEvent.organizer.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>Phone: {currentEvent.organizer.phone ?? "0000000000"}</span>
          </div>
        </div>
      </div>

      {/* Venue */}
      <div className="mb-8">
        <h3 className="mb-4 font-nata-sans-bd text-lg text-gray-800">Venue Details</h3>

        <div className="mb-4 flex flex-wrap gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Notebook size={16} className="text-[#5a2ea6]" />
            <span>{currentEvent.venue.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#5a2ea6]" />
            <span>Capacity: {currentEvent.venue.capacity}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#5a2ea6]" />
            <span>
              Location: {currentEvent.venue.location_geo.area},{" "}
              {currentEvent.venue.location_geo.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Heart size={16} className="text-[#5a2ea6]" />
            Rating:{" "}
            <StarRating
              rating={currentEvent.venue.average_rating.average_rating}
              showValue={true}
              size={14}
            />
            <span className="font-nata-sans-rg">({currentEvent.venue.average_rating.count})</span>
          </div>
        </div>

        {/* Map */}
        {currentEvent.venue.location_geo && (
          <>
            <div className="mb-6 overflow-hidden rounded-2xl border">
              <iframe
                title="Venue location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  currentEvent.venue.location_geo.location
                )}&output=embed`}
                className="h-[300px] w-full border-0"
                loading="lazy"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                currentEvent.venue.location_geo.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center font-nata-sans-md text-sm text-[#5a2ea6] hover:underline"
            >
              Open in Google Maps
            </a>
          </>
        )}
      </div>

      {/* Gallery */}
      {currentEvent.venue.images.length > 1 && (
        <div>
          <h3 className="mb-4 font-nata-sans-bd text-lg text-gray-800">Gallery</h3>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {currentEvent.venue.images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-xl border">
                <img
                  src={img.image_url}
                  alt={img.alt_text}
                  className="h-32 w-full object-cover transition hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoggedIn && <RatingsSection targetType="event" targetId={currentEvent.id} />}

      {!isRegistered && (
        <>
          {/* Action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-10 flex justify-center"
          >
            <motion.button
              whileHover={
                isLoggedIn && isClient && !createMutation.isPending ? { scale: 1.04 } : {}
              }
              whileTap={isLoggedIn && isClient && !createMutation.isPending ? { scale: 0.97 } : {}}
              onClick={handleRegister}
              disabled={(isLoggedIn && !isClient) || createMutation.isPending}
              className={`group inline-flex items-center gap-2 rounded-xl px-8 py-3 font-nata-sans-md text-sm transition-all ${
                isLoggedIn && isClient
                  ? "bg-[#5a2ea6] text-white hover:bg-purple-800 active:scale-95 disabled:opacity-70"
                  : "cursor-not-allowed bg-gray-200 text-gray-500"
              } `}
            >
              {createMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  {!isLoggedIn && (
                    <>
                      <LogIn size={18} className="transition group-hover:scale-110" />
                      Login to register
                    </>
                  )}

                  {isLoggedIn && !isClient && (
                    <>
                      <AlertCircle size={18} className="transition group-hover:scale-110" />
                      Only clients can register
                    </>
                  )}

                  {isLoggedIn && isClient && (
                    <>
                      <CheckCircle size={18} className="transition group-hover:scale-110" />
                      Register for this event
                    </>
                  )}
                </>
              )}
            </motion.button>
          </motion.div>
        </>
      )}

      {isLoggedIn && <EventsRecommendations onSelect={handleSelectRecommendation} />}
    </motion.section>
  );
};
