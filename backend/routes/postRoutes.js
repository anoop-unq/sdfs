import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost
} from '../controllers/postController.js';
import { userAuthMiddleware } from '../middileware/userAuth.js';
// import { protect } from '../middleware/authMiddleware.js';

const validRouter = express.Router();

// POST /api/posts - Create a new post (protected)
validRouter.post("/",userAuthMiddleware , createPost);

// GET /api/posts - Get all posts (public)
validRouter.get("/", getPosts);

// GET /api/posts/:id - Get a single post (public)
validRouter.get("/:id", getPost);

validRouter.delete("/:id",userAuthMiddleware,deletePost)

validRouter.put("/:id",userAuthMiddleware,updatePost)
export default validRouter;