const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Bailey';
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('new connection');
  socket.emit('message', formatMessage(botName, 'Welcome to the chat!'));

  // broadcast: send to all clinets except the emitter
  socket.broadcast.emit(
    'message',
    formatMessage(botName, 'A user entered the chat!')
  );
  socket.on('disconnect', () => {
    socket.broadcast.emit(
      'message',
      formatMessage(botName, 'A user left the chat!')
    );
  });

  // listening for chat message
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('User', msg));
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log('listening on port:', PORT));
