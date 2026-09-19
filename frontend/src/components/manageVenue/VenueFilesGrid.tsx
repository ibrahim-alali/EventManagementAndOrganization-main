import React from "react";
import { motion } from "framer-motion";
import { ImageIcon, FileText, Trash2 } from "lucide-react";
import type { UploadedFile } from "../../pages/provider/VenueFiles";
import toast from "react-hot-toast";

type VenueFile = UploadedFile;

interface VenueFilesGridProps {
  files: VenueFile[];
  onDelete: (file: VenueFile) => void;
}

const formatFileSize = (bytes?: number) => {
  if (bytes == null) return "Unknown size";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const confirmDelete = (file: VenueFile, onDelete: (f: VenueFile) => void) => {
  toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-[320px] rounded-xl border border-gray-200 bg-white p-4 font-nata-sans-rg shadow-lg"
      >
        <h4 className="mb-1 font-nata-sans-md text-gray-800">Delete file?</h4>

        <p className="mb-3 text-sm text-gray-500">
          Are you sure you want to delete <span className="font-nata-sans-md">{file.name}</span>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onDelete(file);
              toast.dismiss(t.id);
            }}
            className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    ),
    { position: "top-center", duration: 6000 }
  );
};

export const VenueFilesGrid: React.FC<VenueFilesGridProps> = ({ files, onDelete }) => {
  if (!files.length) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h4 className="mb-1 font-nata-sans-md text-gray-600">No files uploaded</h4>
        <p className="font-nata-sans-rg text-sm text-gray-400">
          Upload images and documents for your venues
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <h4 className="mb-4 font-nata-sans-bd text-gray-800">Uploaded Files</h4>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {files.map((file, index) => (
          <motion.div
            key={file.id ?? index}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-emerald-200 hover:shadow-lg"
          >
            <div className="relative h-32 w-full overflow-hidden bg-gray-50">
              {file.type === "image" ? (
                <img
                  src={file.url}
                  alt={file.name ?? "Venue image"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-emerald-50 text-emerald-600">
                  <FileText className="h-10 w-10 opacity-70" />
                  <span className="mt-1 text-[10px] font-bold uppercase">Document</span>
                </div>
              )}

              {/* Cover badge */}
              {file.is_cover && file.type === "image" && (
                <div className="absolute left-2 top-2 rounded-md bg-emerald-600 px-2 py-1 font-nata-sans-bd text-[10px] text-white shadow-sm">
                  COVER
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => confirmDelete(file, onDelete)}
                  className="rounded-full bg-white p-2.5 text-red-600 shadow-xl transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-3">
              <p className="line-clamp-1 font-nata-sans-md text-xs text-gray-700" title={file.name}>
                {file.name || "Unnamed file"}
              </p>

              <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-2">
                <span className="font-nata-sans-rg text-[10px] text-gray-400">
                  {file.type === "image" ? "Image" : "File"}
                </span>

                {file.size && (
                  <span className="font-nata-sans-rg text-[10px] text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
