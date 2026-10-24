const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const sosRoutes = require('./routes/sosRoutes');

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Config
app.set('socketio', io);

// API Routes
app.use('/api', sosRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('SafeZoneAI SOS Backend Running...');
});

// Real-time Connection Log
io.on('connection', (socket) => {
  console.log('Client Connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});