const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: true });

UserSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.methods.comparePassword = function(password){
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
