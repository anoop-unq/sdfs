import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
  likePost
} from '../controllers/postController.js';
import { userAuthMiddleware } from '../middileware/userAuth.js';
import { handleMulterErrors, upload } from '../middlewares/upload.js';
// import { protect } from '../middleware/authMiddleware.js';

const validRouter = express.Router();

// POST /api/posts - Create a new post (protected)
validRouter.post("/",userAuthMiddleware, upload.single('image'),handleMulterErrors, createPost);

// GET /api/posts - Get all posts (public)
validRouter.get("/", getPosts);

// GET /api/posts/:id - Get a single post (public)
validRouter.get("/:id", getPost);

validRouter.delete("/:id",userAuthMiddleware,deletePost)

validRouter.put("/:id",userAuthMiddleware,upload.single('image'),handleMulterErrors, updatePost)

validRouter.post("/:postId/like",userAuthMiddleware,likePost)
export default validRouter;