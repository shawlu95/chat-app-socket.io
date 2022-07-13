const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoins,
  getUser,
  userLeaves,
  getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Bailey';
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoins(socket.id, username, room);
    console.log(user);
    socket.join(user.room);

    // welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to the chat!'));

    // broadcast: send to all clinets except the emitter
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} entered the chat!`)
      );

    // send a list of users in the current room
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listening for chat message
  socket.on('chatMessage', (msg) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = userLeaves(socket.id);
    if (user) {
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} left the chat!`)
        );

      // send an updated list of users in the current room
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log('listening on port:', PORT));
