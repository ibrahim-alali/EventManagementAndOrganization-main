import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { EventFormValues } from "../EventForm";
import type { EventType } from "../../../../api/events";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import Select, { type SingleValue } from "react-select";

interface StepEventDetailsProps {
  onNext: () => void;
  onClose: () => void;
}

export const StepEventDetails: React.FC<StepEventDetailsProps> = ({
  onNext,
  onClose,
}) => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useFormContext<EventFormValues>();

  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  type EventOption = { value: EventType; label: string };

  const eventOptions: EventOption[] = [
    { value: "seminar", label: "Seminar" },
    { value: "workshop", label: "Workshop" },
    { value: "lecture", label: "Lecture" },
    { value: "panel", label: "Panel" },
    { value: "roundedTable", label: "Round Table" },
    { value: "networking", label: "Networking" },
    { value: "webinar", label: "Webinar" },
    { value: "training", label: "Training" },
    { value: "discussion", label: "Discussion" },
    { value: "exhibition", label: "Exhibition" },
    { value: "conference", label: "Conference" },
  ];

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "42px",
      borderRadius: "0.5rem", // rounded-lg
      borderColor: state.isFocused ? "#fbbf24" : "#d1d5db", // amber-400 / gray-300
      boxShadow: state.isFocused ? "0 0 0 2px #fde68a" : "none", // ring-amber-400
      overflow: "hidden",
      marginTop: "4px",
      "&:hover": {
        borderColor: "#fbbf24",
      },
    }),

    valueContainer: (base: any) => ({
      ...base,
      padding: "0 0.75rem", // px-3
    }),

    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),

    singleValue: (base: any) => ({
      ...base,
      fontSize: "0.92rem",
    }),

    indicatorsContainer: (base: any) => ({
      ...base,
      paddingRight: "0.5rem",
    }),

    menu: (base: any) => ({
      ...base,
      borderRadius: "0.5rem",
      overflow: "hidden",
    }),

    menuList: (base: any) => ({
      ...base,
      padding: 0,
      overflowX: "hidden",
    }),

    option: (base: any, state: any) => ({
      ...base,
      padding: "0.5rem 0.75rem",
      backgroundColor: state.isSelected
        ? "#f59e0b"
        : state.isFocused
        ? "#fff7ed"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      borderRadius: "0.5rem",
      margin: "0.2rem",
      maxWidth: "99%",
      cursor: "pointer",
      ":active" : {
        backgroundColor: state.isSelected
        ? "#f59e0b"
        : "#fffbed",
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="flex flex-col gap-4"
    >
      {/* Title */}
      <div className="flex flex-col">
        <label className="flex items-center gap-1 font-nata-sans-md text-gray-700">
          Title
        </label>
        <input
          type="text"
          {...register("title")}
          className={`mt-1 rounded-lg border px-3 py-2 font-nata-sans-rg focus:outline-none focus:ring-2 focus:ring-amber-400 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="mt-1 font-nata-sans-rg text-sm text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="font-nata-sans-md text-gray-700">Description</label>
        <textarea
          {...register("description")}
          className={`mt-1 rounded-lg border px-3 py-2 font-nata-sans-rg focus:outline-none focus:ring-2 focus:ring-amber-400 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 font-nata-sans-rg text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Date + Start/End Time */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Date */}
        <div className="flex flex-1 flex-col">
          <label className="flex items-center gap-1 font-nata-sans-md text-gray-700">
            <Calendar className="h-4 w-4" /> Date
          </label>
          <input
            type="date"
            {...register("date")}
            className={`mt-1 rounded-lg border px-3 py-2 font-nata-sans-rg focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date && (
            <p className="mt-1 font-nata-sans-rg text-sm text-red-500">
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Start Time */}
        <div className="flex flex-1 flex-col">
          <label className="flex items-center gap-1 font-nata-sans-md text-gray-700">
            <Clock className="h-4 w-4" /> Start Time
          </label>
          <input
            type="time"
            {...register("startTime")}
            className={`mt-1 rounded-lg border px-3 py-2 font-nata-sans-rg focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              errors.startTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.startTime && (
            <p className="mt-1 font-nata-sans-rg text-sm text-red-500">
              {errors.startTime.message}
            </p>
          )}
        </div>

        {/* End Time */}
        <div className="flex flex-1 flex-col">
          <label className="flex items-center gap-1 font-nata-sans-md text-gray-700">
            <Clock className="h-4 w-4" /> End Time
          </label>
          <input
            type="time"
            {...register("endTime")}
            className={`mt-1 rounded-lg border px-3 py-2 font-nata-sans-rg focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              errors.endTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.endTime && (
            <p className="mt-1 font-nata-sans-rg text-sm text-red-500">
              {errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      {/* Type + Capacity */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Type */}
        <div className="flex flex-1 flex-col">
          <label className="font-nata-sans-md text-gray-700">Event Type</label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              const handleChange = (option: SingleValue<EventOption>) => {
                field.onChange(option?.value); // field يريد EventType فقط
              };

              const selectedOption =
                eventOptions.find((opt) => opt.value === field.value) || null;

              return (
                <Select
                  value={selectedOption}
                  onChange={handleChange}
                  options={eventOptions}
                  isClearable={false}
                  styles={selectStyles}
                  className="font-nata-sans-md"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#fffbed",
                      primary: "#ffb342",
                    },
                  })}
                />
              );
            }}
          />
        </div>

        {/* Capacity */}
        <div className="flex flex-1 flex-col">
          <label className="font-nata-sans-md text-gray-700">Capacity</label>
          <input
            type="number"
            {...register("capacity", { valueAsNumber: true })}
            min={1}
            className={`mt-1 rounded-lg border px-3 py-2 font-nata-sans-rg focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              errors.capacity ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.capacity && (
            <p className="mt-1 font-nata-sans-rg text-sm text-red-500">
              {errors.capacity.message}
            </p>
          )}
        </div>
      </div>

      {/* ================= Actions ================= */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-gray-300 px-6 py-2 font-nata-sans-md text-gray-700 transition hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(onNext)}
          className="rounded-lg bg-amber-500 px-8 py-2 font-nata-sans-bd text-white transition hover:bg-amber-600"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};
