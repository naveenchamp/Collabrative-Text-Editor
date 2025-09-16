const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from any origin

// Create HTTP and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Shared document content
let document = "";

// When a new client connects
wss.on('connection', (ws) => {
  console.log('✅ New client connected');

  // Send initial document to the new client
  ws.send(JSON.stringify({ type: 'init', data: document }));

  // Listen for incoming messages
  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.type === 'update') {
        document = parsed.data;

        // Broadcast update to all other clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'update', data: document }));
          }
        });
      }
    } catch (err) {
      console.error('❌ Error parsing message:', err.message);
    }
  });

  // On disconnect
  ws.on('close', () => {
    console.log('❎ Client disconnected');
  });
});

// Optional: test HTTP route
app.get('/', (req, res) => {
  res.send('✅ WebSocket server is running.');
});

// Start server
const PORT = process.env.PORT || 5000;  // ✅ use Render’s assigned port
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
