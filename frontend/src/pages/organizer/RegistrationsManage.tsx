import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Users } from "lucide-react";
import * as XLSX from "xlsx";

/* =======================
   Hooks
======================= */
import {
  useGetOrganizerRegistrations,
  useAcceptRegistration,
  useRejectRegistration,
  useCancelRegistrationByProvider,
} from "../../hooks/useRegistrationsManage";

import type { EventRegistrationStatus } from "../../api/registrations";

/* =======================
   Components
======================= */
import { RegistrationsHeader } from "../../components/manageRegistration/RegistrationsHeader";
import { RegistrationsTable } from "../../components/manageRegistration/RegistrationsTable";
import { ActionConfirmModal } from "../../components/common/ActionConfirmModal";
import { ModalPortal } from "../../components/common/ModalPortal";

/* =======================
   Types
======================= */
export type RegistrationAction = "accept" | "reject" | "cancel";

export type RegistrationsStatusFilter = EventRegistrationStatus | "all";

export type RegistrationsFilterValue = {
  status: RegistrationsStatusFilter;
};

/* =======================
   Component
======================= */
export const RegistrationsManage: React.FC = () => {
  /* ---------- State ---------- */
  const [filter, setFilter] = useState<RegistrationsFilterValue>({
    status: "all",
  });

  const [modal, setModal] = useState<{
    open: boolean;
    action?: RegistrationAction;
    registrationId?: string;
  }>({ open: false });

  /* ---------- Queries ---------- */
  const {
    data: registrations = [],
    isLoading,
    isFetching,
  } = useGetOrganizerRegistrations();

  /* ---------- Mutations ---------- */
  const acceptMutation = useAcceptRegistration();
  const rejectMutation = useRejectRegistration();
  const cancelMutation = useCancelRegistrationByProvider();

  /* ---------- Derived Data ---------- */
  const visibleRegistrations = useMemo(() => {
    if (filter.status === "all") return registrations;
    return registrations.filter((r) => r.status === filter.status);
  }, [registrations, filter.status]);

  /* ---------- Handlers ---------- */
  const handleAccept = async (id: string) => {
    await toast.promise(acceptMutation.mutateAsync(id), {
      loading: "Accepting registration...",
      success: "Registration accepted",
      error: "Failed to accept registration",
    });
  };

  const handleReject = async (id: string) => {
    await toast.promise(rejectMutation.mutateAsync(id), {
      loading: "Rejecting registration...",
      success: "Registration rejected",
      error: "Failed to reject registration",
    });
  };

  const handleCancel = async (id: string) => {
    await toast.promise(cancelMutation.mutateAsync(id), {
      loading: "Cancelling registration...",
      success: "Registration cancelled",
      error: "Failed to cancel registration",
    });
  };

  const handleExportExcel = () => {
    if (!visibleRegistrations.length) {
      toast.error("No data to export");
      return;
    }

    toast.success("Export started");

    const rows = visibleRegistrations.map((r) => ({
      "Registration ID": r.id,
      "Client Name": r.attendee.full_name,
      "Client Email": r.attendee.email,

      "Event Name": r.event_data.title,
      "Event Type": r.event_data.type,

      "Registration Status": r.status,

      "Registration Date": new Date(r.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    XLSX.writeFile(workbook, "registrations.xlsx");
    setTimeout(() => {
      toast.success("Excel file exported");
    }, 1500)
  };

  /* =======================
     Render
  ======================= */
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="p-8 font-nata-sans-rg"
    >
      {/* ---------- Header ---------- */}
      <RegistrationsHeader
        title="Registrations"
        subtitle="Manage event registrations and attendee actions"
        icon={<Users />}
        filter={filter}
        onFilterChange={setFilter}
        onExport={handleExportExcel}
      />

      {/* ---------- Table ---------- */}
      <RegistrationsTable
        registrations={visibleRegistrations}
        isLoading={isLoading || isFetching}
        onAccept={(id) =>
          setModal({ open: true, action: "accept", registrationId: id })
        }
        onReject={(id) =>
          setModal({ open: true, action: "reject", registrationId: id })
        }
        onCancel={(id) =>
          setModal({ open: true, action: "cancel", registrationId: id })
        }
      />

      {/* ---------- Modal ---------- */}
      <ModalPortal>
        <ActionConfirmModal
          open={modal.open}
          action={modal.action!}
          target="registration"
          loading={
            acceptMutation.isPending ||
            rejectMutation.isPending ||
            cancelMutation.isPending
          }
          onClose={() => setModal({ open: false })}
          onConfirm={async () => {
            if (!modal.registrationId || !modal.action) return;

            if (modal.action === "accept") {
              await handleAccept(modal.registrationId);
            }

            if (modal.action === "reject") {
              await handleReject(modal.registrationId);
            }

            if (modal.action === "cancel") {
              await handleCancel(modal.registrationId);
            }

            setModal({ open: false });
          }}
        />
      </ModalPortal>
    </motion.section>
  );
};
