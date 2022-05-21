const consola = require('consola');

module.exports = (io, socket) => {
  const sendNotification = (payload) => {
    if (payload.type == 'ready') {
      console.log(payload.id);
      socket.to(payload.id).emit('readyforpickup');
    } else if (payload.type == 'complete') {
      socket.to(payload.id).emit('complete');
    } else if (payload.type == 'neworder') {
      console.log('New Order Event')
      socket.broadcast.emit('neworder');
    }
  }

  const testFunction = (payload) => {
    console.log(payload);
  }

  const joinRoom = (user) => {
    consola.info(`User ${user.email} has connected`);
    socket.join(user.id);
  }

  socket.on('notification:join', joinRoom);
  socket.on('notification:send', sendNotification);
  socket.on('notification:test', testFunction);
}