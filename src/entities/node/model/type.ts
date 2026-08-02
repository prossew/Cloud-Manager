export type NodeStatus = "online" | "offline" | "maintenance";

export interface NodeMetrics {
  cpuUsage: number;
  ramUsage: number;
  ping?: number;
  bandWithUp?: number;
  bandWithDown?: number;
  uptime: string;
  diskUsage: number;
}

export interface ServerNode {
  id: string;
  name: string;
  ip: string;
  country: string;
  countryCode: string;
  status: NodeStatus;
  metrics: NodeMetrics;
  lastSeen: string;
}
