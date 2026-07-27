import { create } from "zustand";
import type { ServerNode, NodeMetrics } from "./type";

interface NodeState {
  nodes: ServerNode[];
  selectedNodeId: string | null;

  setNodes: (nodes: ServerNode[]) => void;
  selectNode: (id: string | null) => void;
  updateNodeMetrics: (id: string, metrics: NodeMetrics) => void;
}

export const useNodeStore = create<NodeState>((set) => ({
  nodes: [],
  selectedNodeId: null,

  setNodes: (nodes) => set({ nodes }),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeMetrics: (id, metrics) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, metrics, lastSeen: new Date().toISOString() }
          : node,
      ),
    })),
}));
