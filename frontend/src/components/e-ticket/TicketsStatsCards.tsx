import React from "react";
import { Users, Tag, Crown, GraduationCap } from "lucide-react";

import { type TicketsStats } from "../../api/invitations";
import { StatCard } from "./StatCard";

interface TicketsStatsCardsProps {
  stats?: TicketsStats;
  isLoading?: boolean;
}

export const TicketsStatsCards: React.FC<TicketsStatsCardsProps> = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Guests"
        value={stats?.totalguests ?? 0}
        icon={Users}
        accent="blue"
        isLoading={isLoading}
      />

      <StatCard
        label="Regular"
        value={stats?.totalregular ?? 0}
        icon={Tag}
        accent="amber"
        isLoading={isLoading}
      />

      <StatCard
        label="VIP"
        value={stats?.totalvip ?? 0}
        icon={Crown}
        accent="violet"
        isLoading={isLoading}
      />

      <StatCard
        label="Students"
        value={stats?.totalstudent ?? 0}
        icon={GraduationCap}
        accent="emerald"
        isLoading={isLoading}
      />
    </div>
  );
};
