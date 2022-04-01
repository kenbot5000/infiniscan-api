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
    console.log(user)
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
      phone: req.body.phone,
      address: {
        address1: req.body.address1,
        address2: req.body.address2,
        barangay: req.body.barangay,
        city: req.body.city,
      }
    });
    await newUser.save();
    await Util.incrementID('User');
    res.sendStatus(201);
  }
});

router.patch('/:id', async (req, res) => {
  const exists = await User.exists({ _id: req.params.id });
  if (exists) {
    const user = await User.findOne({ _id: req.params.id });
    user.email = req.body.email;
    user.password = req.body.password;
    user.lastname = req.body.lastname;
    user.firstname = req.body.firstname;
    user.phone = req.body.phone;
    await user.save();
    res.json({ res: user });
  } else {
    res.status(404).json({ message: 'User does not exist' });
  }
});

router.patch('/:id/address', async (req, res) => {
  const exists = await User.exists({ _id: req.params.id });
  if (exists) {
    const user = await User.findOne({ _id: req.params.id });
    user.address.set('address1', req.body.address1);
    user.address.set('address2', req.body.address2);
    user.address.set('barangay', req.body.barangay);
    user.address.set('city', req.body.city);
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

// router.post('/auth/generatelink', async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (user) {
//     res.json({ id: user._id })
//   }
// })

router.post('/auth/confirmemail', async (req, res) => {
  const exists = await User.exists({ email: req.body.email });
  if (exists) {
    const user = await User.findOne({ email: req.body.email });
    user.confirmed = true;
    await user.save();
    console.log(user)
    res.sendStatus(200);
  }
})

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
      phone: req.body.phone,
      address: {
        address1: req.body.address1,
        address2: req.body.address2,
        barangay: req.body.barangay,
        city: req.body.city,
      },
      confirmed: false,
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
