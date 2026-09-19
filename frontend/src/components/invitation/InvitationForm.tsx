import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import { motion } from "framer-motion";
import { useEventsQuery } from "../../hooks/useEventsManage";

// Types
import { type InvitationsRequest, type TicketType } from "../../api/invitations";

// Props
interface InvitationFormProps {
  onSubmit: (data: InvitationsRequest) => void;
  isSubmitting?: boolean;
}

// Form Schema
const schema = z.object({
  event: z.string().nonempty("Event is required"),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  receiverPhone: z.string().min(8, "Invalid phone number"),
  ticketType: z.enum(["student", "vip", "regular"]),
  sendViaWhatsapp: z.boolean(),
});

export type FormValues = z.infer<typeof schema>;

const ticketOptions: { label: string; value: TicketType }[] = [
  { label: "Student", value: "student" },
  { label: "VIP", value: "vip" },
  { label: "Regular", value: "regular" },
];

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "44px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#f59e0b" : "#e5e7eb", // amber-500 / gray-200
    boxShadow: state.isFocused ? "0 0 0 2px rgba(245, 158, 11, 0.3)" : "none",
    "&:hover": {
      borderColor: "#f59e0b",
    },
  }),

  valueContainer: (base: any) => ({
    ...base,
    padding: "0 16px",
  }),

  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),

  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af", // gray-400
    fontSize: "15px",
  }),

  singleValue: (base: any) => ({
    ...base,
    fontSize: "16px",
    color: "#111827", // gray-900
  }),

  menu: (base: any) => ({
    ...base,
    borderRadius: "12px",
    marginTop: "6px",
    overflow: "hidden",
  }),

  menuList: (base: any) => ({
    ...base,
    padding: 0,
    overflowX: "hidden",
  }),

  option: (base: any, state: any) => ({
    ...base,
    fontSize: "16px",
    backgroundColor: state.isSelected
      ? "#f59e0b"
      : state.isFocused
        ? "#fef3c7" // amber-100
        : "white",
    color: state.isSelected ? "white" : "#111827",
    cursor: "pointer",
  }),
};

export const InvitationForm: React.FC<InvitationFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const { data: events = [] } = useEventsQuery({});

  const { control, handleSubmit, register, formState, reset } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        event: "",
        guestName: "",
        receiverPhone: "",
        ticketType: "student",
        sendViaWhatsapp: false,
      },
    });

  // Map events for react-select
  const eventOptions = events.map((e: any) => ({
    label: e.title,
    value: e.id,
  }));

  const submitHandler = (data: FormValues) => {
    const payload: InvitationsRequest = {
      receiver_phone: data.receiverPhone,
      event: data.event,
      guest_name: data.guestName,
      ticket_type: data.ticketType,
      send_via_whatsapp: data.sendViaWhatsapp,
    };

    onSubmit(payload);
    reset({ ...data, guestName: "", receiverPhone: "" });
  };

  return (
    <motion.div
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="mb-4 font-nata-sans-bd text-gray-800">
        Create Invitation
      </h4>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* Event Select */}
        <div>
          <label className="mb-1 block font-nata-sans-md text-sm text-gray-700">
            Select Event
          </label>
          <Controller
            name="event"
            control={control}
            render={({ field }) => {
              const selectedOption = eventOptions.find(
                (option) => option.value === field.value,
              );

              return (
                <Select
                  options={eventOptions}
                  placeholder="Choose an event..."
                  styles={selectStyles}
                  value={selectedOption || null}
                  onChange={(option: any) => field.onChange(option?.value)}
                />
              );
            }}
          />

          {formState.errors.event && (
            <p className="mt-1 text-xs text-red-500">
              {formState.errors.event.message}
            </p>
          )}
        </div>

        {/* Attendee Email */}
        <div>
          <label className="mb-1 block font-nata-sans-md text-sm text-gray-700">
            Attendee Phone
          </label>
          <input
            type="text"
            {...register("receiverPhone")}
            placeholder="+1 234 567"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {formState.errors.receiverPhone && (
            <p className="mt-1 text-xs text-red-500">
              {formState.errors.receiverPhone.message}
            </p>
          )}
        </div>

        {/* Attendee Name */}
        <div>
          <label className="mb-1 block font-nata-sans-md text-sm text-gray-700">
            Attendee Name
          </label>
          <input
            type="text"
            {...register("guestName")}
            placeholder="Full name"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {formState.errors.guestName && (
            <p className="mt-1 text-xs text-red-500">
              {formState.errors.guestName.message}
            </p>
          )}
        </div>

        {/* Ticket Type */}
        <div>
          <label className="mb-1 block font-nata-sans-md text-sm text-gray-700">
            Ticket Type
          </label>
          <Controller
            name="ticketType"
            control={control}
            render={({ field }) => {
              const selectedOption = ticketOptions.find(
                (option) => option.value === field.value,
              );

              return (
                <Select
                  options={ticketOptions}
                  placeholder="Select ticket type"
                  styles={selectStyles}
                  value={selectedOption}
                  onChange={(option: any) => field.onChange(option.value)}
                />
              );
            }}
          />
          {formState.errors.ticketType && (
            <p className="mt-1 text-xs text-red-500">
              {formState.errors.ticketType.message}
            </p>
          )}
        </div>

        {/* Send via WhatsApp */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("sendViaWhatsapp")}
            className="h-4 w-4 rounded border-gray-300 text-amber-500 accent-amber-500 focus:ring-amber-500"
          />
          <label className="font-nata-sans-md text-sm text-gray-700">
            Send via WhatsApp
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-nata-sans-md text-white transition-all hover:shadow-lg"
        >
          {isSubmitting ? "Generating..." : "Generate & Send Invitation"}
        </button>
      </form>
    </motion.div>
  );
};
