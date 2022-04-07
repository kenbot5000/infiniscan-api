require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const conn_string = process.env.CONNECTION_STRING;
const consola = require('consola');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.APP_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

mongoose.connect(conn_string, dbConfig);

app.use(express.json());
app.use(cors());

app.options('*', cors())

// Routes
const userRoute = require('./routes/user.route');
const ingredientRoute = require('./routes/ingredient.route');
const foodRoute = require('./routes/food.route');
const archiveRoute = require('./routes/archive.route');
const adminRoute = require('./routes/admin.route');
const orderRoute = require('./routes/order.route');
const idRoute = require('./routes/increment.route');
const notificationRoute = require('./routes/notification.route');
const rewardRoute = require('./routes/reward.route');

app.use('/user', userRoute);
app.use('/ingredient', ingredientRoute);
app.use('/food', foodRoute);
app.use('/archive', archiveRoute);
app.use('/admin', adminRoute);
app.use('/order', orderRoute);
app.use('/increment', idRoute);
app.use('/notification', notificationRoute);
app.use('/rewards', rewardRoute);

// Socket.io
const notificationSocket = require('./sockets/notificationSocket');

const socketRegistration = (socket) => {
  notificationSocket(io, socket);
  consola.info('Client connected via socket.io');
}
io.on('connection', socketRegistration);

server.listen(port, () => {
  consola.ready({ message: `Infiniscan is now listening at port ${port}`, badge: true });
});
