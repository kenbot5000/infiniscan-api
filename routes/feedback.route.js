const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback').Feedback;

router.get('/', async (req, res) => {
  let feedback = await Feedback.find();
  res.json({ res: feedback });
});

router.post('/', async (req, res) => {
  const today = new Date();
  const newFeedback = new Feedback({
    created: today,
    user: req.body.order.user,
    order: req.body.order,
    feedback: req.body.feedback
  });
  await newFeedback.save();
  res.status(201).json({ res: 'Feedback sent successfully!' });
});

module.exports = router;