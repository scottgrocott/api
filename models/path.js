const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema({
  map_id: {
    type: String, // Unique identifier for the map or environment this path belongs to
    required: true
  },
  property: {
    type: String, // Property to animate (e.g., 'position', 'rotation', 'scale')
    required: true
  },
  from: {
    type: String, // Starting value (e.g., '0 0 0' for position)
    required: true
  },
  to: {
    type: String, // Ending value (e.g., '0 2 0' for position)
    required: true
  },
  dur: {
    type: Number, // Duration of the animation in milliseconds
    required: true,
    min: 0
  },
  dir: {
    type: String, // Direction or mode (e.g., 'normal', 'alternate')
    default: 'normal'
  },
  easing: {
    type: String, // Easing function (e.g., 'linear', 'easeInOutQuad')
    default: 'linear'
  },
  startEvents: {
    type: [String], // Array of events to trigger animation start (e.g., ['click', 'mouseenter'])
    default: []
  },
  pauseEvents: {
    type: [String], // Array of events to pause the animation
    default: []
  },
  resumeEvents: {
    type: [String], // Array of events to resume the animation
    default: []
  },
  elasticity: {
    type: Number, // Elasticity factor for certain easing types (e.g., elastic animations)
    default: 0
  },
  delay: {
    type: Number, // Delay before animation starts in milliseconds
    default: 0,
    min: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Path = mongoose.model('Path', pathSchema, 'paths');

module.exports = Path;