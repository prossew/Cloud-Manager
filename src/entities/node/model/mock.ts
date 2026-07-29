import type { ServerNode } from "./type";

export const MOCK_NODES: ServerNode[] = [
  {
    id: "vps-de-1",
    name: "Frankfurn-Core",
    ip: "194.87.12.44",
    country: "Germany",
    countryCode: "DE",
    status: "online",
    metrics: {
      cpuUsage: 18,
      ramUsage: 42,
      ping: 35,
      bandWithUp: 12.1,
      bandWithDown: 45.1,
    },
    lastSeen: new Date().toISOString(),
  },
  {
    id: "vps-fi-2",
    name: "Helsinki-Gateway",
    ip: "95.216.88.102",
    country: "Finland",
    countryCode: "FI",
    status: "online",
    metrics: {
      cpuUsage: 89,
      ramUsage: 78,
      ping: 18,
      bandWithUp: 88.0,
      bandWithDown: 120.5,
    },
    lastSeen: new Date().toDateString(),
  },
  {
    id: "vps-nl-3",
    name: "Amsterdam-Edge",
    ip: "185.220.101.5",
    country: "Netherlands",
    countryCode: "NL",
    status: "offline",
    metrics: {
      cpuUsage: 0,
      ramUsage: 0,
      ping: 0,
      bandWithUp: 0,
      bandWithDown: 0,
    },
    lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];
