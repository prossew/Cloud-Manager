import { Client } from "ssh2";

export interface NodeMetrics {
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  networkSpeed: number;
}

interface SSHConfig {
  host: string;
  username: string;
  privateKey?: Buffer | string;
  password?: string;
  port?: number;
}

export const fetchLiveVpsMetrics = (
  config: SSHConfig,
): Promise<NodeMetrics> => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      const cmd = `
        vmstat 1 2 | tail -1 | awk '{print 100 - $15}'
        free -m | awk '/Mem:/ {printf "%.1f", ($2 - $7) / $2 * 100}'
        df -h / | awk 'NR==2 {print $5}' | tr -d '%'
      `;

      conn.exec(cmd, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }

        let output = "";
        stream.on("data", (data: Buffer) => {
          output += data.toString();
        });

        stream.on("close", () => {
          conn.end();
          const lines = output
            .trim()
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          const rawCpu = parseFloat(lines[0]);
          const rawRam = parseFloat(lines[1]);
          const rawDisk = parseFloat(lines[2]);

          const cpuUsage = isNaN(rawCpu)
            ? 0
            : Math.min(100, Math.max(0, Math.round(rawCpu)));
          const ramUsage = isNaN(rawRam)
            ? 0
            : Math.min(100, Math.max(0, Math.round(rawRam)));
          const diskUsage = isNaN(rawDisk)
            ? 0
            : Math.min(100, Math.max(0, Math.round(rawDisk)));

          resolve({
            cpuUsage,
            ramUsage,
            diskUsage,
            networkSpeed: 100,
          });
        });
      });
    });

    conn.on("error", (err) => {
      reject(err);
    });

    conn.connect({
      host: config.host,
      port: config.port || 22,
      username: config.username || "root",
      privateKey: config.privateKey,
      password: config.password,
      readyTimeout: 20000,
    });
  });
};
