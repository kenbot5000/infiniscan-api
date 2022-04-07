const express = require('express');
const router = express.Router();
// Models
const Food = require('../models/Food').Food;

router.get('/earn', async (req, res) => {
  const food = await Food.find({ points: { $gt: 0 } });
  res.json({ res: food });
})

router.post('/earn', async (req, res) => {
  if (req.query.id) {
    const foodToAdd = await Food.findById(req.query.id);
    foodToAdd.points = req.body.points;
    await foodToAdd.save();
    res.json({ res: foodToAdd })
  }
});

module.exports = router;