const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let dashboardClient = null;
let raxyClient = null;

console.log("WebSocket Server Running on ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("New Client Connected");

  ws.on("message", (message) => {
    const data = message.toString();

    // Identify Dashboard
    if (data === "ROLE:DASHBOARD") {
      dashboardClient = ws;
      console.log("Dashboard Connected");
      return;
    }

    // Identify Raxy Client
    if (data === "ROLE:RAXY") {
      raxyClient = ws;
      console.log("Raxy Client Connected");
      return;
    }

    console.log("Received:", data);

// If message comes from Raxy → send to Dashboard
    if (dashboardClient && ws === raxyClient) {
    dashboardClient.send(data);
    }

// If message comes from Dashboard → send to Raxy
    if (raxyClient && ws === dashboardClient) {
    raxyClient.send(data);
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