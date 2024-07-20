// models/problemSubmission.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProblemSubmissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['submitted', 'solved', 'not solved'],
    default: 'submitted',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: false,
  },
  score: {
    type: Number,
    required: false, // Set to true if you want to make it mandatory
    default: 0, // Default score value, can be adjusted based on your requirements
  },
  evaluated: {  // New field
    type: Boolean,
    default: false,
  },
  totalNumberOfTestCases: { // New field
    type: Number,
    required: false, // Set to true if you want to make it mandatory
    default: 0, // Default value, can be adjusted based on your requirements
  },
});

module.exports = mongoose.models.ProblemSubmission || mongoose.model('ProblemSubmission', ProblemSubmissionSchema);
