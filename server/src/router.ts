import { IncomingMessage, ServerResponse } from "node:http";
import { getNodes, addNode } from "./store.js";

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

  const { url, method } = req;

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

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
};
