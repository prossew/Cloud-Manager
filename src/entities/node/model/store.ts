import { create } from "zustand";
import type { ServerNode, NodeMetrics } from "./type";

interface NodeState {
  nodes: ServerNode[];
  selectedNodeId: string | null;
  isLoading: boolean;

  error: string | null;

  setNodes: (nodes: ServerNode[]) => void;
  selectNode: (id: string | null) => void;
  addNode: (node: ServerNode) => void;
  updateNodeMetrics: (id: string, metrics: NodeMetrics) => void;

  fetchNodes: () => Promise<void>;
  connectWebSocket: () => () => void;
}

export const useNodeStore = create<NodeState>((set) => ({
  nodes: [],
  selectedNodeId: null,
  isLoading: false,
  error: null,

  setNodes: (nodes) => set({ nodes }),

  selectNode: (id) => set({ selectedNodeId: id }),

  addNode: (newNode) =>
    set((state) => ({
      nodes: [...state.nodes, newNode],
    })),

  updateNodeMetrics: (id, metrics) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, metrics, lastSeen: new Date().toISOString() }
          : node,
      ),
    })),

  fetchNodes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3001/api/nodes");
      if (!response.ok) throw new Error("Ошибка при загрузке серверов");
      const data = await response.json();
      set({ nodes: data, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  connectWebSocket: () => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "METRICS_UPDATE") {
          set({ nodes: data.payload });
        }
      } catch (err) {
        console.error("WS Parse error:", err);
      }
    };

    return () => {
      ws.close();
    };
  },
}));
