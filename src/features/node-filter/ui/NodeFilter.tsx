import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export type StatusFilter = "all" | "online" | "offline";

interface NodeFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

export const NodeFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: NodeFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск по названию или IP..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg self-start sm:self-auto">
        <Button
          variant={statusFilter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => onStatusChange("all")}
          className="text-xs h-7 px-3"
        >
          Все
        </Button>
        <Button
          variant={statusFilter === "online" ? "default" : "ghost"}
          size="sm"
          onClick={() => onStatusChange("online")}
          className="text-xs h-7 px-3"
        >
          Online
        </Button>
        <Button
          variant={statusFilter === "offline" ? "default" : "ghost"}
          size="sm"
          onClick={() => onStatusChange("offline")}
          className="text-xs h-7 px-3"
        >
          Offline
        </Button>
      </div>
    </div>
  );
};
