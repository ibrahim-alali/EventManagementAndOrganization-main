import React, { useRef, type DragEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader2, AlertCircle, MapPin, Trash2 } from "lucide-react";

interface VenueFilesUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onUploadClick: () => void;
  onClear: () => void;
  isUploading?: boolean;
  disabled?: boolean;
}

export const VenueFilesUploader: React.FC<VenueFilesUploaderProps> = ({
  onFilesSelected,
  onUploadClick,
  onClear,
  isUploading = false,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    onFilesSelected(Array.from(files));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled || isUploading) return;

    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadButtonClick = () => {
    if (disabled) {
      onUploadClick();
      return;
    }

    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* ===== Upload Button ===== */}
      <div className="flex justify-end gap-2">
        {!disabled && (
          <motion.button
            whileHover={!disabled ? { scale: 1.03 } : undefined}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
            onClick={onClear}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-red-600 hover:shadow-md"
          >
            <Trash2 className="h-4 w-4" />
            Clear Selection
          </motion.button>
        )}

        <motion.button
          whileHover={!disabled ? { scale: 1.03 } : { scale: 1.03 }}
          whileTap={!disabled ? { scale: 0.97 } : { scale: 0.97 }}
          onClick={handleUploadButtonClick}
          disabled={isUploading}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-nata-sans-md text-sm transition ${
            disabled
              ? "bg-red-400 text-white hover:bg-red-600"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          } `}
        >
          {disabled ? (
            <MapPin className="h-4 w-4" />
          ) : isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          {disabled ? "Select Venue" : "Upload Files"}
        </motion.button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* ===== Drop Zone ===== */}
      <motion.div
        onDrop={disabled ? undefined : handleDrop}
        onDragOver={disabled ? undefined : handleDragOver}
        whileHover={!disabled ? { scale: 1.01 } : { scale: 1.01 }}
        className={`rounded-2xl border-2 border-dashed p-12 text-center text-gray-600 transition ${
          disabled
            ? "border-red-100 bg-red-50/20 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            : "border-emerald-300 bg-emerald-50/20 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
        } `}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          {disabled ? (
            <AlertCircle className="h-8 w-8 text-red-400" />
          ) : (
            <UploadCloud className="h-8 w-8 text-emerald-500" />
          )}
        </div>

        <h4 className="mb-1 font-nata-sans-md">
          {disabled ? "Please select a venue first" : "Drag and drop files here"}
        </h4>

        <p className="font-nata-sans-rg text-sm opacity-80">
          {disabled
            ? "Select a venue above to enable file uploads"
            : "or click the upload button above"}
        </p>
      </motion.div>
    </div>
  );
};
