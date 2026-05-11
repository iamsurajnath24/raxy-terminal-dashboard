"use client";

import { useEffect, useRef } from "react";

import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("TERMINAL COMPONENT MOUNTED");

    const term = new XTerm({
      cursorBlink: true,
      convertEol: true,
    });

    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);

      fitAddon.fit();
    }

    window.addEventListener("resize", () => {
      fitAddon.fit();
    });

    const socket = new WebSocket(
      "wss://raxy-terminal-dashboard.onrender.com"
    );

    socket.onopen = () => {
      console.log("SOCKET OPENED");

      term.writeln("Connected to WebSocket Server");

      socket.send("ROLE:DASHBOARD");
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
      socket.close();

      term.dispose();
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