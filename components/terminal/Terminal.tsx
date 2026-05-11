"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<XTerm | null>(null);

useEffect(() => {
  console.log("TERMINAL COMPONENT MOUNTED");

  const term = new XTerm();

  if (terminalRef.current) {
    term.open(terminalRef.current);
  }

  const socket = new WebSocket(
    "wss://raxy-terminal-dashboard.onrender.com"
  );

  socket.onopen = () => {
  console.log("SOCKET OPENED");

  term.writeln("Connected to WebSocket Server");

  socket.send("ROLE:DASHBOARD");

  socket.send("TEST_MESSAGE_FROM_DASHBOARD");
};  

  socket.onmessage = (event) => {
    console.log("MESSAGE RECEIVED:", event.data);

    term.write("\r\n");
    term.write(String(event.data));
    term.write("\r\n$ ");
  };

  socket.onclose = () => {
    console.log("SOCKET CLOSED");
  };

  socket.onerror = (err) => {
    console.log("SOCKET ERROR:", err);
  };

  return () => {
    console.log("USEEFFECT CLEANUP RUNNING");

    socket.close();
  };
}, []);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100vh",
        background: "black",
        padding: "10px",
      }}
    />
  );
}