import { createServer } from "node:http";
import { handleHttpRequest } from "./router.js";
import { initWebSocket } from "./ws.js";

const PORT = 3001;

const server = createServer(handleHttpRequest);

initWebSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(` сервер запущен: http://localhost:${PORT}`);
  console.log(` websocket подключен: ws://localhost:${PORT}`);
});

