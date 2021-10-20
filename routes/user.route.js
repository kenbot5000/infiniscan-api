const express = require('express');
const router = express.Router();
const User = require('../models/User').User;
const Util = require('./util');

router.get('/', async (req, res) => {
  const users = await User.find();
  res.json({ res: users });
});

router.get('/:id', async (req, res) => {
  const exists = await User.exists({ _id: req.params.id });
  if (exists) {
    const user = await User.findById(req.params.id);
    res.json({ res: user });
  } else {
    res.status(404).json({ message: 'User does not exist' });
  }
});

router.post('/', async (req, res) => {
  const exists = await User.exists({ email: req.body.email });
  if (exists) {
    res.status(400).json({ message: 'A user with the email currently exists.' });
  } else {
    const currentID = await Util.getID('User');
    const newUser = new User({
      displayID: currentID,
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      points: 0,
    });
    await newUser.save();
    await Util.incrementID('User');
    res.sendStatus(201);
  }
});

router.patch('/:id', async (req, res) => {
  const exists = await User.exists({ _id: req.params.id });
  if (exists) {
    const user = await User.findOne({ _id: req.query.id });
    user.email = req.body.email;
    user.password = req.body.password;
    user.lastname = req.body.lastname;
    user.firstname = req.body.firstname;
    await user.save();
    res.json({ res: user });
  } else {
    res.status(404).json({ message: 'User does not exist' });
  }
});

router.delete('/:id', async (req, res) => {
  const exists = await User.exists({ _id: req.params.id });
  if (exists) {
    await User.findByIdAndRemove(req.params.id);
  } else {
    res.status(404).json({ message: 'User does not exist' });
  }
});

router.post('/auth/register', async (req, res) => {
  const exists = await User.exists({ email: req.body.email });
  if (exists) {
    res.status(400).json({ message: 'A user with the email currently exists.' });
  } else {
    const currentID = await Util.getID('User');
    const newUser = new User({
      displayID: currentID,
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      points: 0,
    });
    await newUser.save();
    await Util.incrementID('User');
    res.json({
      res: JSON.stringify({
        email: newUser.email,
        displayID: currentID,
        id: newUser._id
      })
    }).status(201);
  }
});

router.post('/auth/login', async (req, res) => {
  const exists = await User.exists({ email: req.body.email });
  if (exists) {
    const user = await User.findOne({ email: req.body.email });
    if (user.password === req.body.password) {
      res.json({
        res: JSON.stringify({
          email: user.email,
          displayID: user.displayID,
          id: user._id
        })
      });
    } else {
      res.status(401).json({ message: 'Incorrect password.' });
    }
  } else {
    res.status(404).json({ message: 'An account with that email does not exist.' });
  }
});

module.exports = router;
