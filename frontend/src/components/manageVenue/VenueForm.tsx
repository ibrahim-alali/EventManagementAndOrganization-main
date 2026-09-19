import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateVenue, useUpdateVenue } from "../../hooks/useVenuesManage";
import type {
  Venue,
  CreateVenuePayload,
  UpdateVenuePayload,
} from "../../api/venuesManage";

import { VenueMap } from "./VenueMap";

/* =======================
   Schema
======================= */

const locationSchema = z.object({
  location: z.string().min(1, "Location is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
});

const venueSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().optional(),
  location_geo: locationSchema,
  capacity: z.number().min(1, "Capacity is required"),
  price_per_hour: z.number().min(1, "Price is required"),
});

type VenueFormValues = z.infer<typeof venueSchema>;

/* =======================
   Props
======================= */

interface VenueFormProps {
  mode: "create" | "edit";
  venue?: Venue;
  onClose: () => void;
}

/* =======================
   Component
======================= */

export const VenueForm: React.FC<VenueFormProps> = ({
  mode,
  venue,
  onClose,
}) => {
  const isEdit = mode === "edit";

  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: isEdit
      ? {
          name: venue?.name,
          description: venue?.description,
          capacity: venue?.capacity,
          price_per_hour: venue?.price_per_hour,
          location_geo: venue?.location_geo,
        }
      : {
          location_geo: {
            location: "",
            area: "",
            city: "",
          },
        },
  });

  const locationValue = useWatch({
    control,
    name: "location_geo.location",
  });

  /* ---------- Submit ---------- */

  const onSubmit = (values: VenueFormValues) => {
    if (isEdit && venue) {
      const payload: UpdateVenuePayload = {
        id: venue.id,
        ...values,
      };

      updateVenue.mutate(payload, {
        onSuccess: () => {
          toast.success("Venue updated successfully");
          onClose();
        },
        onError: () => toast.error("Update failed"),
      });
    } else {
      const payload: CreateVenuePayload = values;

      createVenue.mutate(payload, {
        onSuccess: () => {
          toast.success("Venue created successfully");
          onClose();
        },
        onError: () => toast.error("Creation failed"),
      });
    }
  };

  /* ---------- Map Handler ---------- */

  const handleLocationSelect = (coords: string) => {
    setValue("location_geo.location", coords, { shouldValidate: true });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm " +
    "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none";

  /* =======================
       Render
  ======================= */

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-7xl rounded-2xl bg-white p-8 font-nata-sans-rg shadow-xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
      >
        {/* ---------- Header ---------- */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-nata-sans-bd text-2xl">
            {isEdit ? "Edit Venue" : "Add Venue"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="transition-all duration-150 hover:scale-110 hover:text-emerald-700"
          >
            <X />
          </button>
        </div>

        {/* ---------- Content ---------- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* ---------- Right : Form ---------- */}
          <div className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Venue Name
              </label>
              <input {...register("name")} className={inputClass} />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className={inputClass}
              />
            </div>

            {/* City & Area */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Area
                </label>
                <input
                  {...register("location_geo.area")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  {...register("location_geo.city")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Capacity & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  {...register("capacity", { valueAsNumber: true })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price / hour
                </label>
                <input
                  type="number"
                  {...register("price_per_hour", {
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-start gap-3 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createVenue.isPending || updateVenue.isPending}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {isEdit ? "Update Venue" : "Create Venue"}
              </button>
            </div>
          </div>

          {/* ---------- Left : Map ---------- */}
          <div className="flex h-[450px] flex-col justify-center overflow-hidden rounded-2xl">
            <VenueMap value={locationValue} onChange={handleLocationSelect} />
            {errors.location_geo?.location && (
              <p className="mt-1 text-xs text-red-500">
                {errors.location_geo.location.message}
              </p>
            )}
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};
