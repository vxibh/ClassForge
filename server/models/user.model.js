const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  batch: {
    type: Number,
    min: 1,
    max: 9,
    required: function() { return !this.isTeacher; }
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    unique: true,
    sparse: true
  },
  enrolledClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  postSubmissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostSubmission'
  }],
  problemSubmissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProblemSubmission'
  }]
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
