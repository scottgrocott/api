const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/gr55_navigator', { useNewUrlParser: true, useUnifiedTopology: true });


const patchSchema = new mongoose.Schema({
  program_id: {
    type: Number,
    required: true
  },
  bank: {
    type: Number,
    required: true
  },
  channel: {
    type: Number,
    required: true
  },
  notes: {
    type: String // Text is represented as String in Mongoose
  },
  title: {
    type: String // Text is represented as String in Mongoose
  },
  artist: {
    type: String // Text is represented as String in Mongoose
  }
}, {
  timestamps: true // Optional: Adds createdAt and updatedAt fields
});

const Patch = mongoose.model('Patch', patchSchema, 'patches');

module.exports = Patch;

