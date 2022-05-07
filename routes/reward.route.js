const express = require('express');
const router = express.Router();
// Models
const Food = require('../models/Food').Food;
const Ingredient = require('../models/Ingredient').Ingredient;
const User = require('../models/User').User;
const Promo = require('../models/Promo').Promo;

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

router.get('/', async (req, res) => {
  const items = await Promo.find({});
  res.json({ res: items });
})

router.post('/', async (req, res) => {
  // * Reward to claim
  if (req.query.id) {
    const item = await Food.findById(req.query.id);
    const newPromo = new Promo({
      item,
      type: "Reward",
      points: req.body.points,
      discount: 0,
    });
    await newPromo.save();
    res.sendStatus(201);
  }
});

router.put('/', async (req, res) => {
  const item = await Promo.findById(req.query.id);
  item.points = req.body.points;
  await item.save();
  res.json({ res: "Points updated!" });
})

router.delete('/', async (req, res) => {
  await Promo.deleteOne({ _id: req.query.id });
  res.json({ res: "Item successfully reset!" });
})

router.post('/claim', async (req, res) => {
  const promoItem = await Promo.findById(req.query.id);
  const foodItem = await Food.findById(promoItem.item._id);
  for (const id of foodItem.ingredients) {
    const ingredient = await Ingredient.findById(id);
    ingredient.stock -= 1;
    await ingredient.save();
  }
  const userToDeduct = await User.findById(req.body.id);
  userToDeduct.points -= promoItem.points;
  await userToDeduct.save();
  res.json({ res: 'Item claimed!' });
 });
module.exports = router;