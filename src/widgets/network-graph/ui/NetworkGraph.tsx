import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNodeStore } from "@/entities/node";

export const NetworkGraph = () => {
  const serverNodes = useNodeStore((state) => state.nodes);

  const flowNodes: Node[] = useMemo(() => {
    return serverNodes.map((node, index) => ({
      id: node.id,
      position: { x: 150 + index * 250, y: 120 },
      data: {
        label: (
          <div className="p-2 text-left font-mono">
            <div className="font-bold text-sm text-foreground">{node.name}</div>
            <div className="text-xs text-muted-foreground">{node.ip}</div>
            <div
              className={`text-[10px] mt-1 font-semibold ${
                node.status === "online" ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              ● {node.status.toUpperCase()}
            </div>
          </div>
        ),
      },
      style: {
        background: "var(--card)",
        color: "var(--card-foreground)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        width: 180,
      },
    }));
  }, [serverNodes]);

  const flowEdges: Edge[] = useMemo(() => {
    if (serverNodes.length < 2) return [];

    const mainNodeId = serverNodes[0].id;

    return serverNodes.slice(1).map((node) => ({
      id: `edge-${mainNodeId}-${node.id}`,
      source: mainNodeId,
      target: node.id,
      animated: node.status === "online",
      style: {
        stroke: node.status === "online" ? "#10b981" : "#f43f5e",
        strokeWidth: 2,
        strokeDasharray: node.status === "offline" ? "5 5" : undefined,
      },
    }));
  }, [serverNodes]);

  return (
    <div className="w-full h-[400px] border rounded-xl overflow-hidden bg-card shadow-sm relative">
      <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
        <Background gap={16} size={1} />
        <Controls className="[&>button]:!bg-card [&>button]:!border-border [&>button]:!fill-foreground hover:[&>button]:!bg-accent" />
      </ReactFlow>
    </div>
  );
};
