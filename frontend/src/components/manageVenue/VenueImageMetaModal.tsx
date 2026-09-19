import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@headlessui/react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  images: z
    .array(
      z.object({
        alt_text: z.string().min(1, "Alt text is required"),
        is_cover: z.boolean(),
        file: z.instanceof(File),
      })
    )
    .refine((images) => images.filter((i) => i.is_cover).length === 1, {
      message: "Please select exactly one cover image",
    }),
});

type FormValues = z.infer<typeof schema>;

interface VenueImageMetaModalProps {
  open: boolean;
  files: File[];
  onClose: () => void;
  onConfirm: (images: FormValues["images"]) => void;
}

export const VenueImageMetaModal: React.FC<VenueImageMetaModalProps> = ({
  open,
  files,
  onClose,
  onConfirm,
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { images: [] },
  });

  const { fields } = useFieldArray({
    control,
    name: "images",
  });

  // init / cleanup
  useEffect(() => {
    if (open && files.length > 0 && fields.length !== files.length) {
      const urls = files.map((file) => URL.createObjectURL(file));
      Promise.resolve().then(() => setImageUrls(urls));
      
      const initialImages = files.map((file, index) => ({
        file,
        alt_text: file.name.split(".")[0],
        is_cover: index === 0,
      }));
      
      reset({ images: initialImages });
      Promise.resolve().then(() => setSelectedCoverIndex(0));
      
      if (!open) {
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
        Promise.resolve().then(() => setImageUrls([]));
        reset({ images: [] });
        Promise.resolve().then(() => setSelectedCoverIndex(0));
        return;
      }
    }
  }, [open, files, fields.length, reset, imageUrls]);

  // sync cover
  useEffect(() => {
    fields.forEach((_, i) => {
      setValue(`images.${i}.is_cover`, i === selectedCoverIndex);
    });
  }, [selectedCoverIndex, fields, setValue]);

  const handleChangeCover = (index: number) => {
    if (fields.length === 1) {
      toast.error("You need at least 2 images to change the cover.", {
        style: { zIndex: 100000 },
      });
      return;
    }
    setSelectedCoverIndex(index);
  };

  const handleSubmitForm = (data: FormValues) => {
    onConfirm(data.images);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={handleSubmit(handleSubmitForm)}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-nata-sans-md text-[1.15rem] font-semibold">Image details</h3>
            <button type="button" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cover selector */}
          <div className="space-y-2">
            <span className="font-nata-sans-md text-sm text-gray-600">Select cover image</span>

            <RadioGroup
              value={selectedCoverIndex}
              onChange={handleChangeCover}
              className="grid grid-cols-2 gap-2"
            >
              {fields.map((_, index) => (
                <RadioGroup.Option key={index} value={index}>
                  {({ checked }) => (
                    <div
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2 transition ${
                        checked
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <img src={imageUrls[index]} className="h-10 w-10 rounded-md object-cover" />
                      <span className="font-nata-sans-rg text-sm">Image {index + 1}</span>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>

          {/* Images meta */}
          <div className="max-h-[45vh] space-y-3 overflow-auto">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 rounded-xl border p-3">
                <img src={imageUrls[index]} className="h-20 w-20 rounded-lg object-cover" />

                <div className="flex-1">
                  <label className="mb-1 ml-1 block font-nata-sans-rg text-xs text-gray-400">
                    Alt Text
                  </label>
                  <input
                    {...register(`images.${index}.alt_text` as const)}
                    defaultValue={field.alt_text}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {selectedCoverIndex === index && (
                  <span className="mt-4 rounded-lg bg-emerald-600 px-2 py-1 font-nata-sans-md text-xs text-white">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>

          {errors.images && <div className="text-sm text-red-500">{errors.images.message}</div>}

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 font-nata-sans-md text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 font-nata-sans-md text-sm text-white hover:bg-emerald-700"
            >
              Confirm & Upload
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};
