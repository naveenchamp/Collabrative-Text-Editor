# COLABRATIVE_TEXT_EDITOR(Using WEBSOCKET)

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: NAVEEN REDDY TIPPASANI

*INTERN ID*:CITS0D507

*DOMAIN*: MERN STACK DEVELOPMENT

*DURATION*: 4 WEEKS

*MENTOR*: NEELA SANTHOSH

## Collaborative Editor (React + WebSocket) is a real-time collaborative text editor built with **React**, **WebSocket**, and **Node.js**. Multiple users can connect and edit the same document simultaneously with instant updates.
## Features
- Real-time collaboration using WebSocket
- React-based frontend
- Express + WS backend server
- Live text sync between clients
- Simple and lightweight setup
## Tech Stack
- **Frontend:** React (Create React App)
- **Backend:** Node.js + Express
- **Real-time:** WebSocket (using `ws` package)
## Setup Instructions
Step 1: Install Backend Dependencies
npm install
Step 2: Start Backend Server
node server.js
Runs on: http://localhost:5000
Step 3: Setup Frontend
cd client
npm install
npm start
Runs on: http://localhost:3000
#WebSocket Setup
Ensure the WebSocket client in App.js connects to:
const newSocket = new WebSocket('ws://localhost:5000');


##output:
<img width="1919" height="867" alt="Image" src="https://github.com/user-attachments/assets/8b43ca67-adfb-42e8-b699-66d18c4f599e" />
