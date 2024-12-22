const express = require('express');
const router = express.Router();

//controllers 
const chatbot = require('../controllers/ChatBot/bot.controller')

//routes
router.post('/chat-bot', chatbot);

module.exports = router;