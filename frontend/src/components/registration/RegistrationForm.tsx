import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  useCreateRegistration,
  useUpdateRegistration,
} from "../../hooks/useRegistrations";

import type { Registration } from "../../api/registrations";

/* ================= Schema ================= */

const registrationSchema = z.object({

});

type RegistrationFormData = z.infer<typeof registrationSchema>;

/* ================= Props ================= */

interface RegistrationFormProps {
  registration?: Registration; // undefined => create
  eventId?: string;
  onClose: () => void;
}

/* ================= Component ================= */

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  registration,
  eventId,
  onClose,
}) => {
  const isEdit = Boolean(registration);

  const createMutation = useCreateRegistration();
  const updateMutation = useUpdateRegistration();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {

    },
  });

  /* ===== Submit ===== */
  const onSubmit = (data: RegistrationFormData) => {
    const payload = {
      event: eventId!,
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: registration!.id, data },
        {
          onSuccess: () => {
            toast.success("Registration updated successfully");
            onClose();
          },
          onError: () => {
            toast.error("Failed to update registration");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Registration created successfully");
          onClose();
        },
        onError: () => {
          toast.error("Failed to create registration");
        },
      });
    }
  };

  /* ================= UI ================= */

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 font-nata-sans-rg"
    >

    </motion.form>
  );
};
