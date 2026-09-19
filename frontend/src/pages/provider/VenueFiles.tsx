import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ImagePlus, MapPin } from "lucide-react";
import toast from "react-hot-toast";

import { useUploadVenueImages, useDeleteVenueImage } from "../../hooks/useVenuesManage";
import { VenueFilesUploader } from "../../components/manageVenue/VenueFilesUploader";
import { VenueFilesGrid } from "../../components/manageVenue/VenueFilesGrid";
import { SelectVenueModal } from "../../components/manageVenue/SelectVenueModal";

import type { LocalVenueImage } from "../../api/venuesManage";
import { VenueImageMetaModal } from "../../components/manageVenue/VenueImageMetaModal";
import { ModalPortal } from "../../components/common/ModalPortal";

export type UploadedFile = {
  id?: string;
  url: string;
  size?: number;
  type: "image" | "file";
  name?: string;
  is_cover?: boolean;
};

export const VenueFiles: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

  // 🆕 metadata modal state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);

  const { mutateAsync, isPending } = useUploadVenueImages();
  const { mutateAsync: deleteImage } = useDeleteVenueImage();

  // ==== لما المستخدم يضغط Upload ====
  const handleUploadClick = () => {
    if (!selectedVenue) {
      setIsVenueModalOpen(true);
      return;
    }
  };

  // ==== بعد اختيار الفينيو من المودال ====
  const handleVenueSelect = (venue: { id: string; name: string }) => {
    setSelectedVenue(venue);
    setIsVenueModalOpen(false);

    toast.success(`Venue selected: ${venue.name}`);
  };

  // ==== Files chosen (open meta modal) ====
  const handleFilesSelected = useCallback(
    (selectedFiles: File[]) => {
      if (!selectedVenue) {
        toast.error("Please select a venue first");
        return;
      }

      if (!selectedFiles.length) return;

      setPendingFiles(selectedFiles);
      setIsMetaModalOpen(true);
    },
    [selectedVenue]
  );

  // ==== Confirm meta + upload ====
  const handleMetaConfirm = async (images: LocalVenueImage[]) => {
    if (!selectedVenue) return;

    const toastId = toast.loading("Uploading images...");
    
    try {
      const res = await mutateAsync({
        venueId: selectedVenue.id,
        images,
      });

      const uploadedFiles: UploadedFile[] = res.images.map((img) => ({
        id: img.id,
        url: img.image_url,
        size: img.image_size,
        type: "image",
        name: img.alt_text,
        is_cover: img.is_cover,
      }));

      setFiles((prev) => [...uploadedFiles, ...prev]);
      setIsMetaModalOpen(false);
      setPendingFiles([]);

      toast.success("Images uploaded successfully", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload images", { id: toastId });
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    if (!file.id || !selectedVenue) return;

    const toastId = toast.loading("Deleting image...");

    try {
      await deleteImage({
        venueId: selectedVenue.id,
        imageId: file.id,
      });

      setFiles((prev) => prev.filter((f) => f.id !== file.id));

      toast.success("Image deleted successfully", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image", { id: toastId });
    }
  };

  const handleClearSelection = () => {
    setFiles([]);
    setSelectedVenue(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-6 p-8 font-nata-sans-rg"
      >
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FileText />
              <h2 className="font-nata-sans-bd text-xl text-gray-800">Files & Images</h2>
            </div>

            <p className="font-nata-sans-rg text-sm text-gray-500">
              Upload and manage venue photos and documents
            </p>
          </div>

          <div className="flex items-center gap-4">
            {selectedVenue && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 font-nata-sans-md text-sm text-emerald-600">
                <MapPin className="h-4 w-4" />
                {selectedVenue.name}
              </div>
            )}

            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-600">
              <ImagePlus className="h-5 w-5" />
              <span className="font-nata-sans-md text-sm">{files.length} images</span>
            </div>
          </div>
        </div>

        {/* ===== Uploader ===== */}
        <VenueFilesUploader
          onFilesSelected={handleFilesSelected}
          onUploadClick={handleUploadClick}
          onClear={handleClearSelection}
          isUploading={isPending}
          disabled={!selectedVenue}
        />

        {/* ===== Files Grid ===== */}
        <VenueFilesGrid files={files} onDelete={handleDeleteFile} />
      </motion.div>

      {/* Venue select modal */}
      <ModalPortal>
        <SelectVenueModal
          open={isVenueModalOpen}
          onClose={() => setIsVenueModalOpen(false)}
          onSelect={handleVenueSelect}
        />
      </ModalPortal>

      {isMetaModalOpen && (
        <ModalPortal>
          <VenueImageMetaModal
            open={isMetaModalOpen}
            files={pendingFiles}
            onClose={() => {
              setIsMetaModalOpen(false);
              setPendingFiles([]); 
            }}
            onConfirm={handleMetaConfirm}
          />
        </ModalPortal>
      )}
    </>
  );
};
