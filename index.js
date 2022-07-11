const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('new connection');
  socket.emit('message', 'Welcome to the chat!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('listening on port:', PORT));
