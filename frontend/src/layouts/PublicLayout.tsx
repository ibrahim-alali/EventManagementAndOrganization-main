import React, { useRef } from "react";
import { useLocation, Outlet } from "react-router-dom";

// Components
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export type LayoutContextType = {
  scrollableNodeRef: React.RefObject<HTMLDivElement | null>;
};

export const PublicLayout: React.FC = () => {
  const scrollableNodeRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const isProviderComponent = location.pathname === "/providers";
  const isOrganizerComponent = location.pathname === "/organizers";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#ede9fe] to-[#e0f2fe] font-nata-sans-rg">
      {/* Navbar */}
      <Header />

      {(isProviderComponent || isOrganizerComponent) && (
        <div className="h-20" />
      )}

      <SimpleBar
        scrollableNodeProps={{ ref: scrollableNodeRef }}
        style={{
          maxHeight:
            isProviderComponent || isOrganizerComponent ? "90vh" : "100vh",
        }}
        className="custom-scrollbar"
      >
        {/* Main Content */}
        <main className="w-full flex-1">
          <Outlet context={{ scrollableNodeRef } satisfies LayoutContextType} />
        </main>

        {/* Footer */}
        <Footer />
      </SimpleBar>
    </div>
  );
};
