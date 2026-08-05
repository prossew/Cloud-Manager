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

export const initialNodes: ServerNode[] = [
  {
    id: "vps-de-1",
    name: "Frankfurt Core",
    ip: "185.220.101.4",
    provider: "Hetzner",
    location: "Germany 🇩🇪",
    status: "online",
    lastSeen: new Date().toISOString(),
    metrics: {
      cpuUsage: 24,
      ramUsage: 42,
      networkSpeed: 120,
      diskUsage: 28,
      uptime: "99.99%",
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

let nodes: ServerNode[] = [...initialNodes];

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

export const updateRandomMetrics = () => {
  nodes = nodes.map((node) => {
    if (node.status === "offline") return node;

    const cpuUsage = Math.min(
      100,
      Math.max(5, node.metrics.cpuUsage + Math.floor(Math.random() * 11) - 5),
    );
    const ramUsage = Math.min(
      100,
      Math.max(10, node.metrics.ramUsage + Math.floor(Math.random() * 7) - 3),
    );
    const networkSpeed = Math.max(
      0,
      node.metrics.networkSpeed + Math.floor(Math.random() * 50) - 25,
    );
    const diskUsage = Math.min(
      100,
      Math.max(5, node.metrics.diskUsage + Math.floor(Math.random() * 7) - 3),
    );

    return {
      ...node,
      lastSeen: new Date().toISOString(),
      metrics: {
        cpuUsage,
        ramUsage,
        networkSpeed,
        diskUsage,
        uptime: node.metrics.uptime,
      },
    };
  });
  return nodes;
};
