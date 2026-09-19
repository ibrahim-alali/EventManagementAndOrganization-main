import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { useCreateEvent, useUpdateEvent } from "../../../hooks/useEventsManage";
import { useOutletContext } from "react-router-dom";

import type { Event } from "../../../api/eventsManage";
import type { Booking } from "../../../api/bookings";
import type { EventType } from "../../../api/events";

import { WizardHeader } from "./WizardHeader";
import { StepEventDetails } from "./steps/StepEventDetails";
import { StepSelectBooking } from "./steps/StepSelectBooking";
import { StepConfirmation } from "./steps/StepConfirmation";
import { ScrollToTop } from "../../common/ScrollToTop";

/* =======================
   Wizard Steps
======================= */

export type WizardStep = 1 | 2 | 3;

/* =======================
   Zod Schema
======================= */

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.custom<EventType>(),
  capacity: z.number().min(1),
  bookingId: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

/* =======================
   Props
======================= */

interface EventFormProps {
  mode: "create" | "edit";
  event?: Event;
  onClose: () => void;
}

type LayoutContextType = {
  scrollableNodeRef: React.RefObject<HTMLDivElement>;
};

/* =======================
   Component
======================= */

export const EventForm: React.FC<EventFormProps> = ({ mode, event, onClose }) => {
  const isEditMode = mode === "edit";
  const initialEvent = isEditMode ? event : undefined;

  const [step, setStep] = useState<WizardStep>(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const { scrollableNodeRef } = useOutletContext<LayoutContextType>();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialEvent
      ? {
          title: initialEvent.title,
          description: initialEvent.description,
          date: initialEvent.date,
          startTime: initialEvent.start_time.slice(0, 5),
          endTime: initialEvent.end_time.slice(0, 5),
          type: initialEvent.type,
          capacity: initialEvent.capacity,
          bookingId: initialEvent.booking,
        }
      : {
          title: "",
          description: "",
          date: "",
          startTime: "",
          endTime: "",
          type: "seminar",
          capacity: 1,
          bookingId: undefined,
        },
  });

  /* =======================
       Step Handlers
    ======================= */

  const goToStep = (next: WizardStep) => setStep(next);

  const submitStepOne = () => goToStep(2);

  const submitStepTwo = () => {
    if (!selectedBooking) {
      toast.error("Please select a booking first");
      return;
    }
    goToStep(3);
  };

  const confirmEvent = async () => {
    if (!selectedBooking) return;

    const values = form.getValues();

    const payload = {
      title: values.title,
      description: values.description,
      date: values.date,
      start_time: `${values.startTime}:00`,
      end_time: `${values.endTime}:00`,
      type: values.type,
      capacity: values.capacity,
      booking: values.bookingId!,
      venue: selectedBooking.venue,
    };

    try {
      if (isEditMode && initialEvent) {
        await updateMutation.mutateAsync({
          id: initialEvent.id,
          ...payload,
        });
        toast.success("Event updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Event created successfully");
      }
      onClose();
    } catch {
      toast.error("Something went wrong");
    }
  };

  /* =======================
       Motion Variants
    ======================= */

  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  /* =======================
       Render
    ======================= */

  return (
    <>
      <ScrollToTop scrollableRef={scrollableNodeRef} />

      <FormProvider {...form}>
        <div className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          {/* Wizard Header */}
          <WizardHeader step={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                onSubmit={form.handleSubmit(submitStepOne)}
                className="flex flex-col gap-4"
              >
                <StepEventDetails onNext={submitStepOne} onClose={onClose} />
              </motion.form>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
              >
                <StepSelectBooking
                  selectedBooking={selectedBooking}
                  setSelectedBooking={(booking) => {
                    setSelectedBooking(booking);
                    form.setValue("bookingId", booking.id);
                  }}
                  onNext={submitStepTwo}
                  onBack={() => setStep(1)}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
              >
                <StepConfirmation
                  values={form.getValues()}
                  booking={selectedBooking!}
                  isSubmitting={createMutation.isPending || updateMutation.isPending}
                  onConfirm={confirmEvent}
                  onBack={() => goToStep(2)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FormProvider>
    </>
  );
};
