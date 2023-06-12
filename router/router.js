import { Router } from 'express';
import { routes } from '../utils/constants.js';
import {
  registerValidation,
  postCreateValidation,
} from '../utils/validations.js';
import UserController from '../controllers/user-controller.js';
import PostController from '../controllers/post-controller.js';
import authMiddleware from '../middleware/auth-middleware.js';
import multer from 'multer';
import LikeController from '../controllers/like-controller.js';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(routes.REGISTER, registerValidation, UserController.register);
router.post(routes.LOGIN, UserController.login);
router.post(routes.LOGOUT, UserController.logout);
router.get(routes.ACTIVATE, UserController.activate);
router.post(routes.REGISTER_PROVIDER, UserController.registerWithProvider);
router.get(routes.REFRESH, UserController.refresh);
router.get(routes.ME, UserController.getMe);
router.get(routes.USER, UserController.getUser);
router.get(routes.USER_BY_EMAIL, UserController.getUserByEmail);
router.put(
  routes.USER_UPDATE,
  upload.single('avatar'),
  UserController.updateUser
);
router.post(routes.POST, upload.single('banner'), PostController.createPost);
router.post(
  routes.SAVE_IMAGE,
  upload.single('image'),
  PostController.saveImage
);
router.put(routes.POST, upload.single('banner'), PostController.updatePost);
router.post(
  routes.SAVE_IMAGE,
  upload.single('image'),
  PostController.saveImage
);
router.post(routes.REMOVE_IMAGES, PostController.removeImages);
router.get(routes.POSTS, PostController.getPosts);
router.get(routes.POST_BY_ID, PostController.getPostById);
router.get(routes.POST_DRAFT, PostController.getDraft);
router.put(routes.VISIT, PostController.visitPost);
router.delete(routes.POST_BY_ID, PostController.deletePost);
router.post(routes.LIKE, LikeController.likePost);
router.delete(routes.LIKE, LikeController.removeLike);
router.put(routes.BOOKMARKS, UserController.updateBookmarks);

export default router;
