import React from "react";
import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  pageTitle: string;
  pageSubtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, pageSubtitle }) => {
  const location = useLocation();
  const isClient = location.pathname.includes("client");
  const isProvider = location.pathname.includes("provider");

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-8 py-[14px]">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div>
          <h2 className="font-nata-sans-bd text-2xl text-gray-800">
            {pageTitle}
          </h2>
          <p className="font-nata-sans-rg text-sm text-gray-500">
            {pageSubtitle}
          </p>
        </div>

        {/* Right */}
        <div className="flex w-1/4 items-center justify-between gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-nata-sans-md text-sm text-slate-500 md:flex">
            <span
              className={`h-2 w-2 animate-pulse rounded-full ${isClient ? "bg-violet-500" : isProvider ? "bg-emerald-500" : "bg-amber-500"}`}
            ></span>
            System Online
          </div>

          {/* Notifications */}
          <button className="relative rounded-xl p-2 text-gray-500 transition hover:bg-gray-100">
            <Bell className="h-6 w-6" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
