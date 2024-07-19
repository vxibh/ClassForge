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
});

const ProblemSubmission = mongoose.model('ProblemSubmission', ProblemSubmissionSchema);

module.exports = ProblemSubmission;
