import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Activity, Cpu, HardDrive } from "lucide-react";
import type { NodeStatus, ServerNode } from "@/entities/node/model/type";

interface NodeCardProps {
  node: ServerNode;
  onManage?: (id: string) => void;
}

export const NodeCard = ({ node, onManage }: NodeCardProps) => {
  const statusStyles: Record<NodeStatus, string> = {
    online: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    offline: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    maintenance: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <Card className="hover:border-primary/50 transition-all duration-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-secondary rounded-lg">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              {node.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground font-mono">{node.ip}</p>
          </div>
        </div>
        <Badge variant="outline" className={statusStyles[node.status]}>
          {node.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> CPU
            </span>
            <span className="font-medium text-foreground">
              {node.metrics.cpuUsage}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                node.metrics.cpuUsage > 80 ? "bg-rose-500" : "bg-primary"
              }`}
              style={{ width: `${node.metrics.cpuUsage}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" /> RAM
            </span>
            <span className="font-medium text-foreground">
              {node.metrics.ramUsage}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                node.metrics.ramUsage > 85 ? "bg-rose-500" : "bg-primary"
              }`}
              style={{ width: `${node.metrics.ramUsage}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex items-center justify-between border-t text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5" /> Uptime: {node.metrics.uptime}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onManage?.(node.id)}
          className="h-8 px-2 text-xs"
        >
          Управление
        </Button>
      </CardFooter>
    </Card>
  );
};
