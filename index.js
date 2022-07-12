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
  socket.broadcast.emit('message', 'A user entered the chat!');
  socket.on('disconnect', () => {
    socket.broadcast.emit('message', 'A user left the chat!');
  });

  // listening for chat message
  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log('listening on port:', PORT));
