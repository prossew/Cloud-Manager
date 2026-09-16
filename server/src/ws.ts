import { WebSocketServer, WebSocket } from "ws";
import { Server } from "node:http";
import { updateLiveMetrics } from "./store.js";

export const initWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Frontend подключился по WebSocket");

    ws.on("close", () => {
      console.log("Frontend отключился от WebSocket");
    });
  });

  setInterval(async () => {
    const updatedNodes = await updateLiveMetrics();
    const payload = JSON.stringify({
      type: "METRICS_UPDATE",
      payload: updatedNodes,
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }, 2000);
};
