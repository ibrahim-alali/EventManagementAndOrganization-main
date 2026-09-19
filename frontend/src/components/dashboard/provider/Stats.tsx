import React from "react";
import { useProviderStats } from "../../../hooks/useProviderDashboard";
import {
  Store,
  CalendarCheck,
  CheckCircle2,
  Archive,
  Loader2,
} from "lucide-react";

export const Stats: React.FC = () => {
  const { data, isLoading } = useProviderStats();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* ===== Total Venues ===== */}
      <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 transition-transform group-hover:scale-110">
            <Store className="h-6 w-6 text-amber-600" />
          </div>
          <span className="rounded-full bg-green-100 px-2 py-1 font-nata-sans-md text-xs text-green-600">
            {isLoading ? "..." : "Active"}
          </span>
        </div>

        <h3 className="font-nata-sans-bd text-3xl text-gray-800">
          {" "}
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          ) : (
            data?.totalVenues ?? 0
          )}{" "}
        </h3>
        <p className="font-nata-sans-rg text-sm text-gray-500">Total Venues</p>
      </div>

      {/* ===== Total Bookings ===== */}
      <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 transition-transform group-hover:scale-110">
            <CalendarCheck className="h-6 w-6 text-blue-600" />
          </div>
          <span className="rounded-full bg-amber-100 px-2 py-1 font-nata-sans-md text-xs text-amber-700">
            {isLoading ? "..." : data?.pendingBookings ?? 0} Pending
          </span>
        </div>

        <h3 className="font-nata-sans-bd text-3xl text-gray-800">
          {" "}
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          ) : (
            data?.totalBookings ?? 0
          )}{" "}
        </h3>
        <p className="font-nata-sans-rg text-sm text-gray-500">
          Total Bookings
        </p>
      </div>

      {/* ===== Accepted Bookings ===== */}
      <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 transition-transform group-hover:scale-110">
            <CheckCircle2 className="h-6 w-6 text-green-900" />
          </div>
        </div>

        <h3 className="font-nata-sans-bd text-3xl text-gray-800">
          {" "}
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          ) : (
            data?.acceptedBookings ?? 0
          )}{" "}
        </h3>
        <p className="font-nata-sans-rg text-sm text-gray-500">
          Accepted Bookings
        </p>
      </div>

      {/* ===== Archived Venues ===== */}
      <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 transition-transform group-hover:scale-110">
            <Archive className="h-6 w-6 text-gray-900" />
          </div>
        </div>

        <h3 className="font-nata-sans-bd text-3xl text-gray-800">
          {" "}
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          ) : (
            data?.archivedVenues ?? 0
          )}{" "}
        </h3>
        <p className="font-nata-sans-rg text-sm text-gray-500">
          Archived Venues
        </p>
      </div>
    </div>
  );
};
