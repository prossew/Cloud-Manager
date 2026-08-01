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

const MOCK_HISTORY_DATA = [
  { time: "12:00", cpu: 20, ram: 46, network: 12 },
  { time: "12:12", cpu: 35, ram: 50, network: 45 },
  { time: "12:20", cpu: 21, ram: 38, network: 23 },
  { time: "12:30", cpu: 44, ram: 49, network: 56 },
  { time: "12:35", cpu: 56, ram: 56, network: 34 },
  { time: "12:41", cpu: 88, ram: 80, network: 45 },
  { time: "12:55", cpu: 11, ram: 32, network: 64 },
];
export const MetricsChart = () => {
  const nodes = useNodeStore((state) => state.nodes);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const selectNode = useNodeStore((state) => state.selectNode);

  const [activeMetric, setActiveMetric] = useState<"cpu" | "ram" | "network">(
    "cpu",
  );
  const activeNode = nodes.find((n) => n.id === selectedNodeId || nodes[0]);
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

      <div className="h-[260px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_HISTORY_DATA}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="time"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} unit="%" />
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
