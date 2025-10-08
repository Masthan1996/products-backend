const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { auth, requireRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// create task
router.post('/', auth, [
  body('title').isString()
], async (req, res) => {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, description, due_date, latitude, longitude } = req.body;
  const task = new Task({
    title, description, due_date,
    owner: req.user._id
  });
  if (latitude && longitude) {
    task.location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
  }
  await task.save();
  res.status(201).json(task);
});

// list tasks for authenticated user
router.get('/', auth, async (req, res) => {
  const condition = {};
  if(req.user.role !== 'admin') {
    condition['owner']= req.user._id;
  }
  console.log('condition');
  
  const tasks = await Task.find(condition).sort('-createdAt');
  
  res.json(tasks);
});

// get single task (owners or admin)
router.get('/:id', auth, async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  const task = await Task.findById(id).populate('owner','username role');
  if (!task) return res.status(404).json({ message: 'Not found' });
  if (!task.owner._id.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  res.json(task);
});

// update task (owner)
router.put('/:id', auth, async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  if (!task.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

  const { title, description, status, due_date, latitude, longitude } = req.body;
  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;
  if (due_date) task.due_date = due_date;
  if (latitude && longitude) {
    task.location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
  }
  await task.save();
  res.json(task);
});

// delete task (owner)
router.delete('/:id', auth, async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  if (!task.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  await task.remove();
  res.json({ message: 'Deleted' });
});

// attach document
router.post('/:id/documents', auth, [
  body('url').isURL()
], async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  if (!task.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  task.documents.push({ url: req.body.url });
  await task.save();
  res.status(201).json(task);
});

// Admin: approve/reject document
router.post('/:taskId/documents/:docId/approve', auth, requireRole('admin'), [
  body('action').isIn(['Approved','Rejected']),
  body('note').optional().isString()
], async (req, res) => {
  const { taskId, docId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const doc = task.documents.id(docId);
  if (!doc) return res.status(404).json({ message: 'Document not found' });

  const action = req.body.action;
  doc.status = action === 'Approved' ? 'Approved' : 'Rejected';
  doc.audit.push({ by: req.user._id, action, note: req.body.note || '' });
  await task.save();
  res.json(task);
});

// geo query: tasks within radius (km) of lat/lng
router.get('/geo/search', auth, async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: 'lat,lng required' });
  // radius in kilometers -> convert to meters for $centerSphere in radians
  const meters = Number(radius) * 1000;
  const results = await Task.find({
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: meters
      }
    }
  }).limit(100);
  res.json(results);
});

module.exports = router;
