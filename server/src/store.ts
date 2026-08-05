export interface ServerNode {
  id: string;
  name: string;
  ip: string;
  provider: string;
  location: string;
  status: "online" | "offline";
  metrics: {
    cpuUsage: number;
    ramUsage: number;
    networkSpeed: number;
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
    metrics: { cpuUsage: 24, ramUsage: 42, networkSpeed: 120 },
  },
  {
    id: "vps-fi-2",
    name: "Helsinki Node",
    ip: "95.217.12.89",
    provider: "Hetzner",
    location: "Finland 🇫🇮",
    status: "online",
    metrics: { cpuUsage: 68, ramUsage: 81, networkSpeed: 450 },
  },
  {
    id: "vps-nl-3",
    name: "Amsterdam Proxy",
    ip: "188.166.45.11",
    provider: "DigitalOcean",
    location: "Netherlands 🇳🇱",
    status: "offline",
    metrics: { cpuUsage: 0, ramUsage: 0, networkSpeed: 0 },
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
    metrics: { cpuUsage: 10, ramUsage: 25, networkSpeed: 50 },
  };
  nodes.push(newNode);
  return newNode;
};

export const updateRandomMetrics = () => {
  nodes = nodes.map((node) => {
    if (node.status === "offline") return node;

    return {
      ...node,
      metrics: {
        cpuUsage: Math.min(
          100,
          Math.max(
            5,
            node.metrics.cpuUsage + Math.floor(Math.random() * 11) - 5,
          ),
        ),
        ramUsage: Math.min(
          100,
          Math.max(
            10,
            node.metrics.ramUsage + Math.floor(Math.random() * 7) - 3,
          ),
        ),
        networkSpeed: Math.max(
          0,
          node.metrics.networkSpeed + Math.floor(Math.random() * 50) - 25,
        ),
      },
    };
  });
  return nodes;
};
