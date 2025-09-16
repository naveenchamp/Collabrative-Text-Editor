import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const isRemote = useRef(false); // prevent echo on local typing

  // Function to handle WebSocket connection + auto-reconnect
  function connectSocket(url) {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "init" || message.type === "update") {
        isRemote.current = true;
        setText(message.data);
      }
    };

    socket.onclose = () => {
      console.warn("⚠️ Socket closed. Reconnecting in 2s...");
      setTimeout(() => connectSocket(url), 2000);
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error", err);
      socket.close();
    };

    socketRef.current = socket;
  }

  useEffect(() => {
    // Choose correct WebSocket URL
    const socketURL =
      process.env.REACT_APP_WS_URL ||
      (window.location.protocol === "https:"
        ? "wss://localhost:5000"
        : "ws://localhost:5000");

    connectSocket(socketURL);

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (!isRemote.current && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "update", data: newText })
      );
    }

    isRemote.current = false; // reset for next input
  };

  return (
    <div className="App">
      <h1>Collaborative Editor</h1>
      <textarea
        value={text}
        onChange={handleChange}
        rows="20"
        cols="80"
        style={{ fontSize: "16px", padding: "10px" }}
      />
    </div>
  );
}

export default App;
