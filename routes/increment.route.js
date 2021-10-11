const express = require('express');
const router = express.Router();
const Util = require('./util');
const Increment = require('../models/Increment');

router.get('/initialize', async (req, res) => {
  const initialized = await Increment.exists({ name: 'Admin' });
  if (initialized) {
    res.json({ message: 'The database IDs have already been initialized!' });
  } else {
    await Util.initialize();
  }
})

module.exports = router;