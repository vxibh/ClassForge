const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSubmissionSchema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class', // Reference to the Class model
    required: true,
  },
  postDetails: {
    type: Schema.Types.ObjectId,
    ref: 'ProblemSubmission', // Reference to the ProblemSubmission model
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post', // Reference to the Post model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PostSubmission', PostSubmissionSchema);
