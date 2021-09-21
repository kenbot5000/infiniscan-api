require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const conn_string = process.env.CONNECTION_STRING;
const consola = require('consola');
const mongoose = require('mongoose');
const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(conn_string, dbConfig);

app.use(express.json());

// Routes
const userRoute = require('./routes/user.route');
const ingredientRoute = require('./routes/ingredient.route');
const foodRoute = require('./routes/food.route');
const archiveRoute = require('./routes/archive.route');
const adminRoute = require('./routes/admin.route');
const orderRoute = require('./routes/order.route');

app.use('/user', userRoute);
app.use('/ingredient', ingredientRoute);
app.use('/food', foodRoute);
app.use('/archive', archiveRoute);
app.use('/admin', adminRoute);
app.use('/order', orderRoute);

app.listen(port, () => {
  consola.ready({ message: `Infiniscan is now listening at http://localhost:${port}`, badge: true });
});