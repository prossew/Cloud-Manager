import { fetchLiveVpsMetrics } from "./ssh-collector.js";

export interface ServerNode {
  id: string;
  name: string;
  ip: string;
  provider: string;
  location: string;
  status: "online" | "offline";
  lastSeen: string;
  metrics: {
    cpuUsage: number;
    ramUsage: number;
    networkSpeed: number;
    diskUsage: number;
    uptime: string;
  };
}

const REAL_VPS_CONFIG = {
  host: "",
  username: "root",
  port: 22,
  password: "",
};

export const initialNodes: ServerNode[] = [
  {
    id: "vps-real-1",
    name: "Production VPS (Ubuntu)",
    ip: "31.77.128.115",
    provider: "Personal VPS",
    location: "Ubuntu 22.04 🚀",
    status: "online",
    lastSeen: new Date().toISOString(),
    metrics: {
      cpuUsage: 0,
      ramUsage: 0,
      networkSpeed: 0,
      diskUsage: 0,
      uptime: "99.9%",
    },
  },
  {
    id: "vps-fi-2",
    name: "Helsinki Node",
    ip: "95.217.12.89",
    provider: "Hetzner",
    location: "Finland 🇫🇮",
    status: "online",
    lastSeen: new Date().toISOString(),
    metrics: {
      cpuUsage: 68,
      ramUsage: 81,
      networkSpeed: 450,
      diskUsage: 55,
      uptime: "99.70%",
    },
  },
  {
    id: "vps-nl-3",
    name: "Amsterdam Proxy",
    ip: "188.166.45.11",
    provider: "DigitalOcean",
    location: "Netherlands 🇳🇱",
    status: "offline",
    lastSeen: new Date().toISOString(),
    metrics: {
      cpuUsage: 0,
      ramUsage: 0,
      networkSpeed: 0,
      diskUsage: 0,
      uptime: "0%",
    },
  },
];

const nodes: ServerNode[] = [...initialNodes];

export const getNodes = () => nodes;

export const addNode = (
  nodeData: Omit<ServerNode, "id" | "metrics" | "status"> & {
    status?: "online" | "offline";
  },
) => {
  const newNode: ServerNode = {
    ...nodeData,
    id: `vps-${Date.now().toString().slice(-4)}`,
    status: nodeData.status || "online",
    lastSeen: new Date().toISOString(),
    metrics: {
      cpuUsage: 10,
      ramUsage: 25,
      networkSpeed: 50,
      diskUsage: 20,
      uptime: "99.0%",
    },
  };
  nodes.push(newNode);
  return newNode;
};

let isFetching = false;

export const updateLiveMetrics = async (): Promise<ServerNode[]> => {
  if (isFetching) {
    return nodes; 
  }

  isFetching = true;
  try {
    const liveMetrics = await fetchLiveVpsMetrics(REAL_VPS_CONFIG);
    nodes[0] = {
      ...nodes[0],
      status: "online",
      lastSeen: new Date().toISOString(),
      metrics: {
        ...nodes[0].metrics,
        cpuUsage: liveMetrics.cpuUsage,
        ramUsage: liveMetrics.ramUsage,
        diskUsage: liveMetrics.diskUsage,
        networkSpeed: liveMetrics.networkSpeed,
      },
    };
  } catch (error) {
    console.error("⚠️ Ошибка SSH:", (error as Error).message);
  } finally {
    isFetching = false;
  }

  for (let i = 1; i < nodes.length; i++) {
    if (nodes[i].status === "offline") continue;
    nodes[i] = {
      ...nodes[i],
      metrics: {
        ...nodes[i].metrics,
        cpuUsage: Math.min(
          100,
          Math.max(
            5,
            nodes[i].metrics.cpuUsage + Math.floor(Math.random() * 5) - 2,
          ),
        ),
      },
    };
  }

  return nodes;
};
