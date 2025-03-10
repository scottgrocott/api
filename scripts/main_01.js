const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const mdb_uri = process.env.MONGODB_GR55_URI || 'mongodb://localhost/gr55_navigator';
// Middleware
app.use(bodyParser.json(),cors());

// MongoDB Connection
mongoose.connect(mdb_uri, {

})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Patch Model
const Patch = require('../models/patch');

// CRUD Routes for Patches

// CREATE - Add a new patch
app.post('/api/v1/gr55/presets', async (req, res) => {
  try {
    const { program_id, bank, channel, notes, title, artist } = req.body;
    const newPatch = new Patch({ program_id, bank, channel, notes, title, artist });
    const savedPatch = await newPatch.save();
    res.status(201).json(savedPatch);
  } catch (error) {
    res.status(400).json({ message: 'Error creating patch', error });
  }
});

// READ - Get all patches
app.get('/api/v1/gr55/presets', async (req, res) => {
  try {
    const patches = await Patch.find();
    res.json(patches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patches', error });
  }
});

// READ - Get a specific patch by ID
app.get('/api/v1/gr55/presets/:id', async (req, res) => {
  try {
    const patch = await Patch.findById(req.params.id);
    if (!patch) return res.status(404).json({ message: 'Patch not found' });
    res.json(patch);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patch', error });
  }
});

// UPDATE - Update a patch by ID
app.put('/api/v1/gr55/presets/:id', async (req, res) => {
  try {
    const { program_id, bank, channel, notes, title, artist } = req.body;
    const patch = await Patch.findByIdAndUpdate(
      req.params.id,
      { program_id, bank, channel, notes, title, artist },
      { new: true, runValidators: true }
    );
    if (!patch) return res.status(404).json({ message: 'Patch not found' });
    res.json(patch);
  } catch (error) {
    res.status(400).json({ message: 'Error updating patch', error });
  }
});

// DELETE - Delete a patch by ID
app.delete('/api/v1/gr55/presets/:id', async (req, res) => {
  try {
    const patch = await Patch.findByIdAndDelete(req.params.id);
    if (!patch) return res.status(404).json({ message: 'Patch not found' });
    res.json({ message: 'Patch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patch', error });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});