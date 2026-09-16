import { IncomingMessage, ServerResponse } from "node:http";
import { Client } from "ssh2";
import { getNodes, addNode } from "./store.js";

const VPS_SSH_CONFIG = {
  host: "",
  port: 22,
  username: "root",
  password: "",
  readyTimeout: 20000,
};

const runSshCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          let output = "";
          let errorOutput = "";

          stream.on("data", (data: Buffer) => {
            output += data.toString();
          });

          stream.stderr.on("data", (data: Buffer) => {
            errorOutput += data.toString();
          });

          stream.on("close", () => {
            conn.end();
            resolve(output || errorOutput || "(выполнено без вывода)");
          });
        });
      })
      .on("error", (err) => {
        reject(err);
      })
      .connect(VPS_SSH_CONFIG);
  });
};

export const handleHttpRequest = (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const { url = "", method } = req;

  if (url === "/api/nodes" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getNodes()));
    return;
  }

  if (url === "/api/nodes" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const newNode = addNode(data);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newNode));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  if (
    url.startsWith("/api/nodes/") &&
    url.endsWith("/exec") &&
    method === "POST"
  ) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { command } = JSON.parse(body);
        if (!command) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Command is required" }));
          return;
        }

        const output = await runSshCommand(command);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ output }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: (err as Error).message }));
      }
    });
    return;
  }

  if (url.startsWith("/api/nodes/") && method === "POST") {
    const isReboot = url.endsWith("/reboot");
    const isStop = url.endsWith("/stop");

    if (isReboot || isStop) {
      const command = isReboot ? "reboot" : "shutdown -h now";
      runSshCommand(command).catch((error: unknown) =>
        console.error(
          `Ошибка при выполнении ${command}:`,
          (error as Error).message,
        ),
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: `Команда ${command} передана`,
        }),
      );
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
};
