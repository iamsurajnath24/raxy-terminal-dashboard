"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Prevent duplicate terminal creation
    if (xtermRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      rows: 30,
      cols: 120,
      theme: {
        background: "#000000",
      },
    });

    xtermRef.current = term;

    term.open(terminalRef.current);

    term.writeln("Connecting to WebSocket Server...");
    term.write("\r\n$ ");

    const socket = new WebSocket("wss://raxy-terminal-dashboard.onrender.com");

    socket.onopen = () => {
      term.writeln("\r\nConnected to WebSocket Server");
      socket.send("ROLE:DASHBOARD");
      term.write("\r\n$ ");
    };

    socket.onmessage = (event) => {
  console.log("FROM SERVER:", event.data);

  term.write("\r\n");
  term.write(event.data);
  term.write("\r\n$ ");
};
    let currentCommand = "";

term.onData((data) => {
  const charCode = data.charCodeAt(0);

  // Enter key
  if (charCode === 13) {
    socket.send(currentCommand);
    term.write("\r\n");
    currentCommand = "";
    return;
  }

  // Backspace
  if (charCode === 127) {
    if (currentCommand.length > 0) {
      currentCommand = currentCommand.slice(0, -1);
      term.write("\b \b");
    }
    return;
  }

  // Normal typing
  currentCommand += data;
  term.write(data);
}); 

    socket.onerror = () => {
      term.writeln("\r\nWebSocket Error");
    };

    socket.onclose = () => {
      term.writeln("\r\nDisconnected from Server");
    };

    return () => {
      socket.close();
      term.dispose();
      xtermRef.current = null;
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