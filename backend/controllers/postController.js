import Post from '../models/Post.js';
import userModel from '../models/user.js';
import { v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized - No user ID found' 
      });
    }

    const { content } = req.body;
    const hasContent = content && content.trim() !== '';
    const hasImage = req.file;

    if (!hasContent && !hasImage) {
      return res.status(400).json({
        success: false,
        error: 'Post must contain either content or an image'
      });
    }

    let imageData = null;
    if (hasImage) {
      try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
        const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
          folder: "posts",
          resource_type: "auto",
          quality: "auto:good"
        });

        imageData = {
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload image',
          details: uploadError.message
        });
      }
    }

    const post = new Post({
      content: hasContent ? content.trim() : null,
      author: req.userId,
      ...(imageData && {
        imageUrl: imageData.url,
        imagePublicId: imageData.publicId
      })
    });

    await post.save();

    try {
      await userModel.findByIdAndUpdate(
        req.userId,
        { $push: { posts: post._id } },
        { new: true }
      );
    } catch (userUpdateError) {
      console.error('User update error:', userUpdateError);
    }

    // Populate author info more thoroughly
    const populatedPost = await Post.findById(post._id)
      .populate({
        path: 'author',
        select: 'name username email bio avatar',
      })
      .lean();

    // Ensure consistent response structure
    const responseData = {
      _id: populatedPost._id,
      content: populatedPost.content,
      imageUrl: populatedPost.imageUrl,
      imagePublicId: populatedPost.imagePublicId,
      author: {
        _id: populatedPost.author._id,
        name: populatedPost.author.name,
        username: populatedPost.author.username,
        avatar: populatedPost.author.avatar
      },
      likes: [],
      comments: [],
      createdAt: populatedPost.createdAt,
      updatedAt: populatedPost.updatedAt
    };

    res.status(201).json({
      success: true,
      post: responseData  // Consistent structure
    });
    
  } catch (error) {
    console.error('Post creation error:', error);
    
    if (imageData?.publicId) {
      await cloudinary.uploader.destroy(imageData.publicId)
        .catch(cleanupError => 
          console.error('Image cleanup failed:', cleanupError)
        );
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// export const createPost = async (req, res) => {
//   try {
//     console.log('Authenticated userId:', req.userId); // Now using userId
    
//     if (!req.userId) {
//       return res.status(401).json({ error: 'Unauthorized - No user ID found' });
//     }

//     const { content } = req.body;

//     // Validate content
//     if (!content || typeof content !== 'string' || content.trim() === '') {
//       return res.status(400).json({ error: 'Valid content is required' });
//     }

//     // Create new post using userId directly
//     const post = new Post({
//       content: content.trim(),
//       author: req.userId // Using the ID from middleware
//     });

//     await post.save();

//     // Update user's posts array
//     await userModel.findByIdAndUpdate(
//       req.userId, // Using the ID from middleware
//       { $push: { posts: post._id } },
//       { new: true }
//     );

//     // Populate author info
//     const populatedPost = await Post.findById(post._id)
//       .populate('author', 'name email bio');

//     res.status(201).json(populatedPost);
    
//   } catch (error) {
//     console.error('Post creation error:', error);
//     res.status(400).json({ 
//       error: 'Failed to create post',
//       details: error.message 
//     });
//   }
// };

// postController.js


export const getPosts = async (req, res) => {
  try {
    // Get all public posts, newest first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email bio photo');
    
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


export const updatePost = async (req, res) => {
  try {
    console.log("Request params:", req.params);
    console.log("User ID from middleware:", req.userId);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file); // Log the uploaded file

    const post = await Post.findById(req.params.id);
    console.log("Found post:", post);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

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
    
    // At least one of content or image must be present
    if ((!content || !content.trim()) && !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Post must contain either content or an image'
      });
    }

    let imageData = null;
    
    // Handle image upload if present
    if (req.file) {
      try {
        // Delete old image if exists
        if (post.imagePublicId) {
          await cloudinary.uploader.destroy(post.imagePublicId);
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
        const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
          folder: "posts",
          resource_type: "auto",
          quality: "auto:good"
        });

        imageData = {
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload image',
          details: uploadError.message
        });
      }
    }

    // Prepare update data
    const updateData = {
      content: content ? content.trim() : post.content,
      ...(imageData && {
        imageUrl: imageData.url,
        imagePublicId: imageData.publicId
      }),
      ...(!req.file && !content && {
        // If no new content or image, keep existing values
        content: post.content,
        imageUrl: post.imageUrl,
        imagePublicId: post.imagePublicId
      })
    };

    // Remove image if requested (you'll need to add this flag from frontend)
    if (req.body.removeImage === 'true') {
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }
      updateData.imageUrl = null;
      updateData.imagePublicId = null;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name username avatar');

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
      error: 'Failed to update post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Like or unlike a post
// Like or unlike a post (using authenticated user ID from middleware)
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; // From auth middleware

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    // Check if user already liked the post
    const isLiked = post.likes.some(id => id.toString() === userId.toString());

    // Toggle like status
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      post: updatedPost
    });

  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update like status' 
    });
  }
};