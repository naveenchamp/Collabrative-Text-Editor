const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path'); // 👈 Add the 'path' module

const app = express();
app.use(cors());

// ✅ ADD THESE TWO LINES BACK TO SERVE YOUR FRONT-END
// ✅ ADD THIS CODE
// Serve the built React app
app.use(express.static(path.join(__dirname, 'build')));

// For any route that is not a static file, send the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Removed "0.0.0.0" as it's often not needed on Render
  console.log(`🚀 Server is live on port ${PORT}`);
});
