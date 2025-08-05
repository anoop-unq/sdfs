import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

export const createPost = async (req, res) => {
  try {
    console.log('Authenticated userId:', req.userId); // Now using userId
    
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized - No user ID found' });
    }

    const { content } = req.body;

    // Validate content
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Valid content is required' });
    }

    // Create new post using userId directly
    const post = new Post({
      content: content.trim(),
      author: req.userId // Using the ID from middleware
    });

    await post.save();

    // Update user's posts array
    await userModel.findByIdAndUpdate(
      req.userId, // Using the ID from middleware
      { $push: { posts: post._id } },
      { new: true }
    );

    // Populate author info
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email bio');

    res.status(201).json(populatedPost);
    
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(400).json({ 
      error: 'Failed to create post',
      details: error.message 
    });
  }
};

// postController.js
export const getPosts = async (req, res) => {
  try {
    // Get all public posts, newest first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email bio');
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email bio');
      
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    console.log("Request params:", req.params); // Debug log
    console.log("User ID from middleware:", req.userId); // Debug log
    
    const post = await Post.findById(req.params.id);
    console.log("Found post:", post);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    // Verify ownership using req.userId from middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized to delete this post' 
      });
    }

    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    console.log("Deleted post:", deletedPost);
    
    if (!deletedPost) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found during deletion' 
      });
    }

    res.json({ 
      success: true,
      message: 'Post deleted successfully',
      deletedPost 
    });
    
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// controllers/postController.js
export const updatePost = async (req, res) => {
  try {
    console.log("Request params:", req.params); // Debug log
    console.log("User ID from middleware:", req.userId); // Debug log
    console.log("Request body:", req.body); // Debug log
    
    const post = await Post.findById(req.params.id);
    console.log("Found post:", post);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    // Verify ownership using req.userId from middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized to edit this post' 
      });
    }

    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Post content is required'
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { content: content.trim() },
      { new: true, runValidators: true }
    );

    console.log("Updated post:", updatedPost);
    
    res.json({ 
      success: true,
      message: 'Post updated successfully',
      post: updatedPost 
    });
    
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};