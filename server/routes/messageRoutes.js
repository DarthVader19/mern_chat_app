// server/routes/messageRoutes.js
const express = require('express');
const Message = require('../models/message');

const router = express.Router();

router.get('/', async (req, res) => {
  const messages = await Message.find().populate('sender');
  res.json(messages);
});

router.post('/', async (req, res) => {
  const { sender, text } = req.body;
  const newMessage = new Message({ sender, text });
  await newMessage.save();
  res.status(201).json(newMessage);
});

module.exports = router;
