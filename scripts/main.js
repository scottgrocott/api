// bots/bot_01.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Bot = require('../models/bot');

const app = express();
app.use(express.json());

// Connect to MongoDB
const connectDB = require('../config/db');
connectDB();

// Bot ID and API key
const BOT_ID = 'bot_01';
const API_KEY = process.env.OPENAI_API_KEY;

app.get('/api/bot_01/response', async (req, res) => {
  try {
    const prompt = req.query.prompt || 'Describe your patrol in the Machine Hub fuel yard';
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    const text = data.choices[0].message.content;

    // Save response to MongoDB
    await Bot.findOneAndUpdate(
      { botId: BOT_ID },
      { lastResponse: text, position: [0, 1, 0] }, // Example position in A-Frame
      { upsert: true, new: true }
    );

    res.json({ botId: BOT_ID, response: text, timestamp: new Date() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Bot 01 (ChatGPT) running on port ${PORT}`));