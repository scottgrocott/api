const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
//const mdb_uri = process.env.MONGODB_GR55_URI || 'mongodb://localhost/gr55_navigator';
// Middleware
app.use(bodyParser.json(),cors());


  
  // MongoDB Connection for metal_throne
  const gr55Db = mongoose.createConnection('mongodb://localhost/gr55_navigator', {

  });

  gr55Db.on('connected', () => console.log('Connected to MongoDB (gr55_navigator)'));
  gr55Db.on('error', err => console.error('MongoDB (gr55_navigator) connection error:', err));

  // MongoDB Connection for metal_throne
  const metalThroneDb = mongoose.createConnection('mongodb://localhost/metal_throne', {

  });
  metalThroneDb.on('connected', () => console.log('Connected to MongoDB (metal_throne)'));
  metalThroneDb.on('error', err => console.error('MongoDB (metal_throne) connection error:', err));
  
  // Import Models
  const Patch = gr55Db.model('Patch', require('../models/patch').schema, 'patches');
  const Path = metalThroneDb.model('Path', require('../models/path').schema, 'paths');

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

// CRUD Routes for Metal Throne Paths

// CREATE - Add a new path
app.post('/api/v1/metal_throne/paths', async (req, res) => {
    try {
      const {
        map_id, property, from, to, dur, dir, easing,
        startEvents, pauseEvents, resumeEvents, elasticity, delay
      } = req.body;
      const newPath = new Path({
        map_id, property, from, to, dur, dir, easing,
        startEvents, pauseEvents, resumeEvents, elasticity, delay
      });
      const savedPath = await newPath.save();
      res.status(201).json(savedPath);
    } catch (error) {
      res.status(400).json({ message: 'Error creating path', error });
    }
  });
  
// READ - Get all paths filtered by map_id (optional query parameter)
app.get('/api/v1/metal_throne/paths', async (req, res) => {
    try {
      const { map_id } = req.query; // Extract map_id from query parameters
      let query = {};
      if (map_id) {
        query.map_id = map_id; // Filter by map_id if provided
      }
      const paths = await Path.find(query);
      if (paths.length === 0) {
        return res.status(404).json({ message: map_id ? `No paths found for map_id "${map_id}"` : 'No paths found' });
      }
      res.json(paths);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching paths', error });
    }
  });
// READ - Get all paths by 'map_id' and 'from' value
app.get('/api/v1/metal_throne/paths/map/:mapId/from/:fromValue', async (req, res) => {
    try {
      const { mapId, fromValue } = req.params; // Extract mapId and fromValue from URL parameters
      const paths = await Path.find({ map_id: mapId, from: fromValue });
      if (paths.length === 0) return res.status(404).json({ message: 'No paths found with the specified "map_id" and "from" value' });
      res.json(paths);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching paths by "map_id" and "from" value', error });
    }
  });
  

  // READ - Get a specific path by ID
  app.get('/api/v1/metal_throne/paths/:id', async (req, res) => {
    try {
      const path = await Path.findById(req.params.id);
      if (!path) return res.status(404).json({ message: 'Path not found' });
      res.json(path);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching path', error });
    }
  });
  
  // UPDATE - Update a path by ID
  app.put('/api/v1/metal_throne/paths/:id', async (req, res) => {
    try {
      const {
        map_id, property, from, to, dur, dir, easing,
        startEvents, pauseEvents, resumeEvents, elasticity, delay
      } = req.body;
      const path = await Path.findByIdAndUpdate(
        req.params.id,
        {
          map_id, property, from, to, dur, dir, easing,
          startEvents, pauseEvents, resumeEvents, elasticity, delay
        },
        { new: true, runValidators: true }
      );
      if (!path) return res.status(404).json({ message: 'Path not found' });
      res.json(path);
    } catch (error) {
      res.status(400).json({ message: 'Error updating path', error });
    }
  });
  
  // DELETE - Delete a path by ID
  app.delete('/api/v1/metal_throne/paths/:id', async (req, res) => {
    try {
      const path = await Path.findByIdAndDelete(req.params.id);
      if (!path) return res.status(404).json({ message: 'Path not found' });
      res.json({ message: 'Path deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting path', error });
    }
  });





// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});