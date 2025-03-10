// models/bot.js
//const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/metal_throne', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb://localhost/metal_throne')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const botSchema = new mongoose.Schema({
  botId: { type: String, required: true, unique: true }, // e.g., "bot_01", "bot_02", "bot_03"
  api: { type: String, required: true }, // e.g., "openai", "grok", "gemini"
  position: { type: [Number], required: true }, // [x, y, z] coordinates in A-Frame
  lastResponse: { type: String, default: '' }, // Last LLM response
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bot', botSchema);

