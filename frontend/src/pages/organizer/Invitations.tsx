import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Hooks
import {
  useInvitations,
  useCreateInvitation,
} from "../../hooks/useInvitations.ts";

// Components
import { InvitationForm } from "../../components/invitation/InvitationForm.tsx";
import { TicketPreview } from "../../components/invitation/TicketPreview.tsx";
import { SentInvitationsList } from "../../components/invitation/SentInvitationsList.tsx";

// Types
import {
  type InvitationsRequest,
  type Invitations as InvitationsType,
} from "../../api/invitations.ts";
import { Mail } from "lucide-react";

/* =======================
   Animation Variants
======================= */

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const Invitations: React.FC = () => {
  const [previewInvitation, setPreviewInvitation] =
    useState<InvitationsType | null>(null);

  // React Query
  const { data: sentInvitations = [], isLoading } = useInvitations();
  const createInvitationMutation = useCreateInvitation();

  const handleCreateInvitation = async (formData: InvitationsRequest) => {
    try {
      const newInvitation =
        await createInvitationMutation.mutateAsync(formData);

      setPreviewInvitation(newInvitation);
      toast.success("Invitation generated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate invitation");
    }
  };

  return (
    <section className="w-full p-8 font-nata-sans-rg">
      {/* Header */}
      <div className="mb-8 flex items-center md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <div
            className="
            flex h-10 w-10 items-center justify-center
            rounded-xl
          "
          >
            <Mail className="h-7 w-7" />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
              Send Invitations
            </h1>
            <p className="mt-1 font-nata-sans-md text-sm text-slate-500">
              Generate and send QR-coded e-tickets
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <InvitationForm
          onSubmit={handleCreateInvitation}
          isSubmitting={createInvitationMutation.isPending}
        />

        <TicketPreview
          invitation={previewInvitation}
          invitations={sentInvitations}
        />
      </div>

      {/* Sent Invitations */}
      <motion.div
        className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h4 className="mb-4 font-nata-sans-bd text-gray-800">
          Sent Invitations
        </h4>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.p
              key="loading"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center justify-center font-nata-sans-md text-sm text-amber-500"
            >
              Loading invitations...
            </motion.p>
          ) : (
            <motion.div
              key="list"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <SentInvitationsList invitations={sentInvitations} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
