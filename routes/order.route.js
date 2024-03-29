const express = require('express');
const router = express.Router();
const User = require('../models/User').User;
const Order = require('../models/Order').Order;
const OrderArchive = require('../models/Order').OrderArchive;
const Food = require('../models/Food').Food;
const Ingredient = require('../models/Ingredient').Ingredient;
const Admin = require('../models/Admin').Admin;

router.get('/', async (req, res) => {
  let orders;
  if (req.query.user && req.query.active) {
    const user = await User.findById(req.query.user);
    orders = await Order.find({ user: user }).or([{ status: 'cart' }, { status: 'waiting' }, { status: 'inprogress' }, { status: 'confirmation' }]);
  }
  else if (req.query.user) {
    // Query by user
    const user = await User.findById(req.query.user)
    orders = await Order.find({ user: user });
  } else {
    // Default
    orders = await Order.find();
  }
  res.json({ res: orders });
});

router.get('/archive', async (req, res) => {
  const orders = await OrderArchive.find();
  res.json({ res: orders });
});

router.get('/search/:id', async (req, res) => {
  try {
    const exists = await Order.exists({ _id: req.params.id });
    if (exists) {
      const order = await Order.findById(req.params.id);
      res.json({ res: order });
    } else {
      res.status(404).json({ message: 'An order does not exist under this ID.' });
    }
  } catch (err) {
    res.status(404).json({ message: 'An order does not exist under this ID.' });
  }
});

router.get('/list', async (req, res) => {
  if (!req.query.status) {
    res.status(400).json({ message: 'Needs status query parameter.' });
  } else {
    let orders = await Order.find({ status: req.query.status });
    res.json({ res: orders });
  }
});

// Add to cart
router.post('/', async (req, res) => {
  const user = await User.findById(req.body.id);
  // Check if an order is already in progress
  const orderInProgress = await Order.exists({ user: user, status: 'inprogress' });
  if (orderInProgress) {
    res.status(400).json({message: 'An order is already currently in progress.'});
  }

  // Get food item to add
  const food = await Food.findById(req.body.foodID);

  // Check if an order is already in cart
  const cartExists = await Order.exists({ user: user, status: 'cart' });
  
  if (cartExists) {
    const cart = await Order.findOne({ user: user, status: 'cart' });
    cart.items.push(food);
    cart.total += food.price;
    cart.subtotal += food.price;
    await cart.save();
    res.json({ res: 'Added to cart successfully!' });
  } else {
    const newCart = new Order({
      created: new Date(),
      user: user,
      items: [food],
      total: food.price,
      promo: [],
      subtotal: food.price,
      status: 'cart'
    });
    await newCart.save();
    res.status(201).json({ res: 'Added to cart successfully!' });
  }
});

router.put('/changestatus', async (req, res) => {
  const order = await Order.findById(req.body.id);

  order.status = req.body.status;
  if (req.body.status == 'inprogress') {
    const server = await Admin.findById(req.body.server);
    order.server = server;
  }

  await order.save();
  res.json({ res: `Order updated to ${req.body.status}!` });
});

router.put('/completeorder', async (req, res) => {
  const order = await Order.findById(req.body.id);
  const user = await User.findById(order.user._id);
  for (const item of order.items) {
    const foodItem = await Food.findById(item._id);
    console.log(foodItem)
    if (foodItem.points) {
      console.log(user)
      user.points += foodItem.points;
      await user.save();
    }
    for (const id of foodItem.ingredients) {
      const ingredient = await Ingredient.findById(id);
      ingredient.stock -= 1;
      await ingredient.save();
    }
  }
  order.status = 'completed';
  await order.save();
  res.json({ res: 'Order completed!' });
});

// Remove from cart
router.put('/', async (req, res) => {
  const user = await User.findById(req.body.id);
  const cart = await Order.findOne({ user: user, status: 'cart' });
  const firstInstance = cart.items.findIndex(o => o._id == req.body.foodID);
  cart.total -= cart.items[firstInstance].price;
  cart.subtotal -= cart.items[firstInstance].price;
  cart.items.splice(firstInstance, 1);
  await cart.save();
  res.json({ res: 'Removed item successfully' });
});

router.delete('/cancel/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = 'cancelled';
  await order.save();
  res.json({ res: 'Order cancelled successfully' });
});
  
router.delete('/archive/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  const toArchive = new OrderArchive(order.toJSON());
  await toArchive.save();
  await Order.findByIdAndRemove(req.params.id);
  res.json({ res: 'Order archived successfully' });
});

module.exports = router;
