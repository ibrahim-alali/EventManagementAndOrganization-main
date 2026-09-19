import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Star,
  Users,
  ChevronUp,
  ChevronDown,
  Eye,
  Calendar,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  useVoteForHost,
  useUpdateVote,
  useDeleteVote,
} from "../../hooks/useHost";

import type { Host } from "../../api/hosts";
import { getToken } from "../../utils/authToken";
import { getRole } from "../../utils/authRole";
import { getInitials } from "../../utils/setAvatar";

interface HostCardProps {
  host: Host;
}

export const HostCard: React.FC<HostCardProps> = ({ host }) => {
  const navigate = useNavigate();
  const voteMutation = useVoteForHost();
  const updateVoteMutation = useUpdateVote();
  const deleteVoteMutation = useDeleteVote();

  /* ================= Auth check ================= */
  const canVote = useMemo(() => {
    const token = getToken();
    const role = getRole();
    return Boolean(token && role === "client");
  }, []);

  /* ================= Vote handlers ================= */
  const handleVote = (value: 1 | -1) => {
    if (!canVote) {
      toast.error("You must be logged in as a client to vote");
      return;
    }

    // 1️⃣ The same vote  → DELETE
    if ((value === 1 && host.upvoted) || (value === -1 && host.downvoted)) {
      if (!host.vote_id) return;

      deleteVoteMutation.mutate(host.vote_id, {
        onSuccess: () => {
          toast.success("Vote removed");
        },
        onError: () => {
          toast.error("Failed to remove vote");
        },
      });

      return;
    }

    // 2️⃣ Seconde vote → PATCH
    if (host.upvoted || host.downvoted) {
      if (!host.vote_id) return;

      updateVoteMutation.mutate(
        { voteId: host.vote_id, value },
        {
          onSuccess: () => {
            toast.success(
              value === 1 ? "Upvote updated 👍" : "Downvote updated 👎"
            );
          },
          onError: () => {
            toast.error("Failed to update vote");
          },
        }
      );

      return;
    }

    // 3️⃣ First vote → POST
    voteMutation.mutate(
      {
        target_user: host.id,
        value,
      },
      {
        onSuccess: () => {
          toast.success("Vote submitted successfully");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Voting failed");
        },
      }
    );
  };

  /* ================= Navigation ================= */
  const handleViewProfile = () => {
    if (host.role === "organizer") {
      navigate(`/events?organizer=${host.id}`);
    } else {
      navigate(`/venues?provider=${host.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: "0 12px 24px -8px rgba(124, 58, 237, 0.15)",
      }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-violet-200 bg-white transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)",
      }}
    >
      {/* Gradient Header */}
      <div
        className="relative h-20 w-full"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
        <div className="absolute -left-2 bottom-0 h-10 w-10 rounded-full bg-white/10" />

        {/* Role Badge */}
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 font-nata-sans-bd text-xs text-violet-700 shadow-sm">
            {host.role === "organizer" ? (
              <Calendar size={12} />
            ) : (
              <MapPin size={12} />
            )}
            {host.role.charAt(0).toUpperCase() + host.role.slice(1)}
          </span>
        </div>
      </div>

      {/* Avatar - Positioned between header and content */}
      <div className="relative z-10 -mt-10 mb-4 flex justify-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white font-nata-sans-bd text-xl font-bold text-white shadow-lg"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
          }}
        >
          {getInitials(host.full_name)}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pb-6">
        {/* Name & Email */}
        <div className="mb-4 text-center">
          <h3 className="mb-1 truncate font-nata-sans-bd text-lg text-gray-800">
            {host.full_name}
          </h3>
          <div className="flex items-center justify-center gap-1.5 font-nata-sans-md text-sm text-gray-500">
            <Mail size={14} className="shrink-0 text-violet-500" />
            <span className="truncate">{host.email}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-4 flex items-center justify-center gap-6">
          {/* Score */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Star size={18} className="fill-amber-400 text-amber-400" />
              <span className="font-nata-sans-bd text-2xl text-gray-800">
                {host.votes_score.toFixed(1)}
              </span>
            </div>
            <span className="font-nata-sans-md text-xs text-gray-500">
              Score
            </span>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-gray-200" />

          {/* Votes */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Users size={16} className="text-violet-500" />
              <span className="font-nata-sans-bd text-2xl text-gray-800">
                {host.votes_count}
              </span>
            </div>
            <span className="font-nata-sans-md text-xs text-gray-500">
              Votes
            </span>
          </div>
        </div>

        {/* Voting Section - Only for clients */}
        {canVote && (
          <div className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <span className="w-20 font-nata-sans-md text-sm text-gray-600">
              Rate host:
            </span>
            <div className="flex items-center justify-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVote(1)}
                disabled={
                  voteMutation.isPending ||
                  updateVoteMutation.isPending ||
                  deleteVoteMutation.isPending
                }
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  host.upvoted
                    ? "bg-green-50 text-green-300"
                    : "bg-green-100 text-green-600 hover:bg-green-200 hover:shadow-md"
                }`}
              >
                <ChevronUp size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVote(-1)}
                disabled={
                  voteMutation.isPending ||
                  updateVoteMutation.isPending ||
                  deleteVoteMutation.isPending
                }
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  host.downvoted
                    ? "bg-red-50 text-red-300"
                    : "bg-red-100 text-red-600 hover:bg-red-200 hover:shadow-md"
                }`}
              >
                <ChevronDown size={20} />
              </motion.button>
            </div>
            {host.upvoted && (
              <span className="w-20 font-nata-sans-md text-xs text-green-600">
                ✓ You upvoted
              </span>
            )}

            {host.downvoted && (
              <span className="w-20 font-nata-sans-md text-xs text-red-600">
                ✓ You downvoted
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewProfile}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-nata-sans-md text-white shadow-lg transition-all hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
          }}
        >
          <Eye size={18} />
          {host.role === "provider" ? "View Venues" : "View Events"}
        </motion.button>
      </div>

      {/* Loading Overlay */}
      {voteMutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <span className="font-nata-sans-md text-sm text-violet-600">
              Submitting vote...
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
