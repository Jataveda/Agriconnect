import StatsCard from "../StatsCard";
import { DollarSign } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <StatsCard
        title="Total Revenue"
        value="$12,450"
        icon={DollarSign}
        trend="+12% from last month"
        trendUp={true}
      />
    </div>
  );
}
