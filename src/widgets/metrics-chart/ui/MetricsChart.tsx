import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNodeStore } from "@/entities/node";

export const MetricsChart = () => {
  const nodes = useNodeStore((state) => state.nodes);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const selectNode = useNodeStore((state) => state.selectNode);

  const [activeMetric, setActiveMetric] = useState<"cpu" | "ram" | "network">(
    "cpu",
  );
  const activeNode = selectedNodeId
    ? nodes.find((node) => node.id === selectedNodeId)
    : nodes[0];
  const chartData = nodes.map((node) => ({
    name: node.name,
    cpu: node.metrics.cpuUsage,
    ram: node.metrics.ramUsage,
    network: node.metrics.networkSpeed,
  }));
  const metricUnit = activeMetric === "network" ? " Mbps" : "%";
  return (
    <div className="w-full border rounded-xl bg-card p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm: items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Аналитика ресурсов</h3>
          <p className="text-xs text-muted-foreground">
            {activeNode
              ? `Сервер ${activeNode.name} (${activeNode.ip})`
              : "Выберите сервер"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedNodeId || activeNode?.id || ""}
            onChange={(e) => selectNode(e.target.value)}
            className="h-9 px-3 text-xs bg-background border rounded-md focus:outline-none"
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>

          <div className="flex bg-muted p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveMetric("cpu")}
              className={`px-3 py-1 rounded-md transition-all ${activeMetric === "cpu" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              CPU
            </button>
            <button
              onClick={() => setActiveMetric("ram")}
              className={`px-3 py-1 rounded-md transition-all ${activeMetric === "ram" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              RAM
            </button>
            <button
              onClick={() => setActiveMetric("network")}
              className={`px-3 py-1 rounded-md transition-all ${activeMetric === "network" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Network
            </button>
          </div>
        </div>
      </div>

      <div className="h-65 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              unit={metricUnit}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
