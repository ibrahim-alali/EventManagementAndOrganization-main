import React from "react";
import { motion, type Variants } from "framer-motion";
import { Download, RefreshCcw } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

import { useInvitations, useTicketsStats } from "../../hooks/useInvitations";

import { GuestHeader } from "../../components/e-ticket/GuestHeader";
import { TicketsStatsCards } from "../../components/e-ticket/TicketsStatsCards";
import { GuestGrid } from "../../components/e-ticket/GuestGrid";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

export const E_Ticket: React.FC = () => {
  const {
    data: invitations,
    isLoading: invitationsLoading,
    refetch: refetchInvitations,
  } = useInvitations();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useTicketsStats();

  const isLoading = invitationsLoading || statsLoading;

  const handleRefresh = async () => {
    toast.loading("Refreshing guest list...", {
      id: "refresh",
    });

    try {
      await Promise.all([refetchInvitations(), refetchStats()]);
      toast.success("Guest list updated", {
        id: "refresh",
      });
    } catch {
      toast.error("Failed to refresh data", {
        id: "refresh",
      });
    }
  };

  const handleDownloadReport = () => {
    if (!invitations || invitations.length === 0) {
      toast.error("No guests to export");
      return;
    }

    toast("PDF export starting...", {
      icon: "📄",
      className: "font-nata-sans-md bg-amber-50 text-amber-900 border border-amber-200",
    });

    const doc = new jsPDF("p", "mm", "a4");

    /* ================= Header ================= */
    const generatedAt = new Date().toLocaleString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Event Organizer", 14, 20);

    doc.setFontSize(14);
    doc.text("Official Guest List Report", 14, 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${generatedAt}`, 14, 38);

    /* ================= Table ================= */
    const tableData = invitations.map((inv) => [
      inv.guest_name,
      inv.ticket_type.toUpperCase(),
      inv.receiver_phone,
      inv.status.toUpperCase(),
      inv.status === "sent" ? "Yes" : "No",
      new Date(inv.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 45,
      head: [["Guest Name", "Type", "Phone", "Status", "Sent (WA)", "Created At"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 9,
        textColor: [51, 65, 85], // slate-700
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [245, 158, 11], // amber-500
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [255, 251, 235], // amber-50
      },
      margin: { left: 14, right: 14 },
    });

    /* ================= Save ================= */
    doc.save("guest-list-report.pdf");

    setTimeout(() => {
      toast.success("PDF report downloaded 📄");
    }, 1200);
  };

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl px-4 py-8 font-nata-sans-rg text-slate-900 sm:px-6 lg:px-8"
    >
      {/* ================= Header ================= */}
      <motion.div variants={pageVariants}>
        <GuestHeader
          title="Guest List"
          description="Manage attendees and view ticket details."
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-nata-sans-md text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>

              <button
                onClick={handleDownloadReport}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-nata-sans-bd text-sm text-white shadow-md transition hover:bg-amber-600"
              >
                <Download className="h-4 w-4" />
                Download Report
              </button>
            </div>
          }
        />
      </motion.div>

      {/* ================= Stats ================= */}
      <motion.section variants={pageVariants} className="mt-8">
        <TicketsStatsCards stats={stats} isLoading={isLoading} />
      </motion.section>

      {/* ================= Guest Grid ================= */}
      <motion.section variants={pageVariants} className="mt-10">
        <GuestGrid invitations={invitations} isLoading={invitationsLoading} />
      </motion.section>
    </motion.main>
  );
};
