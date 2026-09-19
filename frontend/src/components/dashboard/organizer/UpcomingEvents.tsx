import React from "react";
import { Calendar, Plus, MapPin, Loader2, Sparkles } from "lucide-react";
import { useOrganizerUpcomingEvents } from "../../../hooks/useOrganizerDashboard";

interface UpcomingEventsProp {
  onOpen: () => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProp> = ({ onOpen }) => {

  const { data = [], isLoading } = useOrganizerUpcomingEvents();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-nata-sans-bd text-lg text-gray-800">Upcoming Events</h3>

        <button
          onClick={onOpen}
          className="flex items-center gap-1 font-nata-sans-md text-sm text-amber-600 transition-colors hover:text-amber-800"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex h-48 items-center justify-center py-12 text-gray-500">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-amber-500" />
            <span className="font-nata-sans-md text-sm">Loading events...</span>
          </div>
        ) : data.length > 0 ? (
          data.map((event) => (
            <div
              key={event.id}
              className="group rounded-xl border border-gray-100 p-5 transition-all hover:border-amber-200 hover:bg-amber-50/20"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>

                <span className="rounded-full bg-amber-100 px-2 py-1 font-nata-sans-md text-[10px] uppercase text-amber-700">
                  {event.type}
                </span>
              </div>

              <h4 className="mb-1 line-clamp-1 font-nata-sans-bd text-gray-800">
                {event.title}
              </h4>

              <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{event.location}</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-sm">
                <span className="font-nata-sans-rg text-gray-400">
                  {new Date(event.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="font-nata-sans-md text-amber-600">
                  {event.ticketsSold} registered
                </span>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12">
            <Sparkles className="mb-2 h-8 w-8 text-gray-300" />
            <p className="font-nata-sans-md text-sm text-gray-500">
              No upcoming events yet
            </p>
            <button 
              onClick={onOpen}
              className="mt-3 text-xs text-amber-600 underline"
            >
              Start by creating one
            </button>
          </div>
        )}
      </div>
    </div>
  );
};