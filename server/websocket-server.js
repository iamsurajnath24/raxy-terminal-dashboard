const WebSocket = require("ws");
const http = require("http");

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WebSocket Server Running");
});

const wss = new WebSocket.Server({ server });

let dashboardClient = null;
let raxyClient = null;

console.log(`WebSocket Server Running on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("New Client Connected");

  ws.on("message", (message) => {
    const msg = message.toString();

    console.log("Received:", msg);

    if (msg === "ROLE:DASHBOARD") {
      dashboardClient = ws;
      console.log("Dashboard Connected");
      return;
    }

    if (msg === "ROLE:RAXY") {
      raxyClient = ws;
      console.log("Raxy Connected");
      return;
    }

    if (dashboardClient) {
  console.log("Sending message to dashboard");

  dashboardClient.send(msg);
}
  });

  ws.on("close", () => {
    console.log("Client Disconnected");

    if (ws === dashboardClient) {
      dashboardClient = null;
    }

    if (ws === raxyClient) {
      raxyClient = null;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});