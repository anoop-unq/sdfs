import mongoose from 'mongoose';

// postModel.js
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Add visibility settings if needed
  isPublic: {
    type: Boolean,
    default: true
  }
});

const Post = mongoose.model('post', postSchema); // Registered as 'post' (lowercase)
export default Post;