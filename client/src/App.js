import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const isRemote = useRef(false); // prevent echo on local typing

  useEffect(() => {
    const socketURL =
  process.env.NODE_ENV === "production"
    ? "wss://collabrative-text-editor-ix4a.onrender.com"
    : "ws://localhost:5000";

socketRef.current = new WebSocket(socketURL);


    socketRef.current.onopen = () => {
      console.log('✅ Connected to WebSocket server');
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'init' || message.type === 'update') {
        isRemote.current = true;
        setText(message.data);
      }
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (!isRemote.current) {
      // Send update to server
      socketRef.current.send(JSON.stringify({ type: 'update', data: newText }));
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
        style={{ fontSize: '16px', padding: '10px' }}
      />
    </div>
  );
}

export default App;
