"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<XTerm | null>(null);

useEffect(() => {
  const term = new XTerm();
  if (terminalRef.current) {
  term.open(terminalRef.current);
}

  const socket = new WebSocket("wss://raxy-terminal-dashboard.onrender.com");

  socket.onopen = () => {
    term.writeln("Connected to WebSocket Server");
    socket.send("ROLE:DASHBOARD");
  };

  socket.onmessage = (event) => {
    term.write("\r\n");
    term.write(event.data);
    term.write("\r\n$ ");
  };

  return () => {
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