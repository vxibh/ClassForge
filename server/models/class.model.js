const mongoose = require('mongoose');
const { Schema } = mongoose;

const MaterialSchema = new Schema({
  type: { type: String, required: true },
  link: { type: String, required: true },
});

const PostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String},
  date: { type: Date },
  dueDate: { type: Date },
  materials: [MaterialSchema],
});

const ClassSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  posts: [PostSchema],
  code: { type: String, required: true, unique: true } // Add code field
});

module.exports = mongoose.model('Class', ClassSchema);
