const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient').Ingredient;

router.get('/ingredientcount', async (req, res) => {
  const ingredients = await Ingredient.find({}, {stock: 1, critical: 1});
  const lowIngredients = ingredients.filter(i => {
    if (i.critical && i.stock <= i.critical) {
      return i;
    } else if (i.stock == 0) {
      return i;
    }
  })
  const lowLen = lowIngredients.length;
  res.json({ res: lowLen })
});

module.exports = router;