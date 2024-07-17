const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSubmissionSchema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class', // Reference to the Class model
    required: true,
  },
  postDetails: {
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
