export type NodeStatus = "online" | "offline" | "maintenance";

export interface NodeMetrics {
  cpuUsage: number;
  ramUsage: number;
  networkSpeed: number;
  diskUsage: number;
  uptime: string;
  ping?: number;
  bandWithUp?: number;
  bandWithDown?: number;
}

export interface ServerNode {
  id: string;
  name: string;
  ip: string;
  provider: string;
  location: string;
  status: NodeStatus;
  metrics: NodeMetrics;
  lastSeen?: string;
}
