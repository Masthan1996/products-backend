const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  url: String,
  status: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  audit: [{
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['Approved','Rejected'] },
    at: { type: Date, default: Date.now },
    note: String
  }]
}, { _id: true });

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['To Do','In Progress','Done'], default: 'To Do' },
  due_date: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documents: [DocumentSchema],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: undefined } // [lng, lat]
  }
}, { timestamps: true });

// create 2dsphere index for geo queries
TaskSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Task', TaskSchema);
