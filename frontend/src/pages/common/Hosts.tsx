import React, { useMemo, useRef, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "../../layouts/PublicLayout";

import { useHosts } from "../../hooks/useHost";
import type { HostRole } from "../../api/hosts";

// Components
import { HostsSidebar } from "../../components/host/HostsSidebar";
import { HostsClientSidebar } from "../../components/host/HostsClientSidebar";
import { HostsGrid } from "../../components/host/HostsGrid";
import { Pagination } from "../../components/common/Pagination";
import { Loader } from "../../components/common/Loader";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface HostsProps {
  role: HostRole; // "provider" | "organizer"
}

export const Hosts: React.FC<HostsProps> = ({ role }) => {
  const { scrollableNodeRef } = useOutletContext<LayoutContextType>();

  const [filters, setFilters] = useState({
    role,
    search: "",
    min_score: 0,
    min_votes: 0,
    ordering: "",
    page: 1,
    page_size: 12,
  });

  const initialFilters = {
    role,
    search: "",
    min_score: 0,
    min_votes: 0,
    ordering: "",
    page: 1,
    page_size: 12,
  };

  const filterWithUpdateRole = useMemo(() => {
    if (filters.role !== role) {
      return {
        ...filters,
        role,
        page: 1,
      };
    }
    return filters;
  }, [filters, role]);

  const hostsGridTopRef = useRef<HTMLDivElement | null>(null);

  // ===== React Query Get Hosts =====
  const {
    data: hostsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useHosts(filterWithUpdateRole);

  if (isError) {
    console.error("Failed to fetch hosts:", error);
  }

  const location = useLocation();
  const isClient =
    location.pathname === "/client/providers" ||
    location.pathname === "/client/organizers";

  const page = hostsData?.page ?? filters.page;
  const totalCards = hostsData?.total ?? 0;
  const pageSize = hostsData?.page_size ?? filters.page_size;
  const totalPages = Math.ceil(totalCards / pageSize);
  const results = hostsData?.results ?? [];

  return (
    <div
      className="flex min-h-[85vh] w-full items-center justify-center p-2"
      ref={hostsGridTopRef}
    >
      {/* PAGE CONTENT */}
      <div
        className={`mx-auto flex w-full ${
          isClient ? "max-w-6xl flex-col py-4" : "max-w-[86rem] flex-row py-8"
        }  gap-6`}
      >
        {!isClient ? (
          <>
            {/* Sidebar */}
            <div className="w-[21rem] flex-shrink-0">
              <HostsSidebar
                filters={filters}
                onChange={(newFilters) => {
                  setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
                }}
                onClear={() => setFilters(initialFilters)}
              />
            </div>
          </>
        ) : (
          <>
            {/* Sidebar */}
            <div className="w-full flex-shrink-0">
              <HostsClientSidebar
                filters={filters}
                onChange={(newFilters) => {
                  setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
                }}
                onClear={() => setFilters(initialFilters)}
              />
            </div>
          </>
        )}

        {/* GRID COLUMN */}
        <div className="flex min-h-0 flex-1">
          <div className="w-full rounded-3xl bg-white pt-8 shadow-xl">
            {/* Loading State */}
            {isLoading && isClient && <Loader text={"Loading hosts..."} />}

            {isLoading && !isClient && (
              <div className="flex h-[60vh] items-center justify-center py-12 text-gray-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span className="font-nata-sans-md text-sm">Loading hosts...</span>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="flex h-96 flex-col items-center justify-center pt-14 text-center">
                <p className="mb-4 text-red-600">
                  Failed to load hosts. Try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="rounded-lg bg-violet-700 px-6 py-2 text-white hover:bg-violet-800"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && results.length === 0 && (
              <div className="flex h-96 flex-col justify-center pt-14 text-center text-lg text-gray-600">
                No hosts found.
              </div>
            )}

            {/* Hosts Grid */}
            {!isLoading && !isError && results.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${filters.page}-${filters.ordering}-${role}-${filters.search}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <HostsGrid hosts={results} />
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {!isLoading && !isError && totalCards > 0 && (
              <div className="mt-8 border-t pt-6">
                <Pagination
                  page={page}
                  lastPage={totalPages}
                  onPageChange={(page) => {
                    setFilters((prev) => ({ ...prev, page }));

                    const container = scrollableNodeRef.current;
                    const target = hostsGridTopRef.current;

                    if (container && target) {
                      const top =
                        target.getBoundingClientRect().top -
                        container.getBoundingClientRect().top +
                        container.scrollTop;

                      container.scrollTo({
                        top,
                        behavior: "smooth",
                      });
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
