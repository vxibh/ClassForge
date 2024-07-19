// models/postSubmission.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSubmissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  problemSubmissions: [{
    type: Schema.Types.ObjectId,
    ref: 'ProblemSubmission',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostSubmission = mongoose.model('PostSubmission', PostSubmissionSchema);

module.exports = PostSubmission;
