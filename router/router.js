import { Router } from 'express';
import { routes } from '../utils/constants.js';
import { registerValidation } from '../utils/validations.js';
import UserController from '../controllers/user-controller.js';
import PostController from '../controllers/post-controller.js';
import multer from 'multer';
import LikeController from '../controllers/like-controller.js';
import CommentController from '../controllers/comment-controller.js';
import ChatController from '../controllers/chat-controller.js';
import SubscribersController from '../controllers/subscribers-controller.js';
import SearchController from '../controllers/search-controller.js';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(routes.REGISTER, registerValidation, UserController.register);
router.post(routes.LOGIN, UserController.login);
router.get(routes.ACTIVATE, UserController.activate);
router.post(routes.REGISTER_PROVIDER, UserController.registerWithProvider);
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
router.get(routes.LIKE, LikeController.isLiked);
router.get(routes.COUNT_LIKES, LikeController.countLikes);

router.put(routes.BOOKMARKS, UserController.updateBookmarks);
router.get(routes.BOOKMARKS, PostController.getBookmarks);

router.get(routes.COMMENTS, CommentController.getComments);
router.post(routes.COMMENT, CommentController.createComment);
router.put(`${routes.COMMENT}/:id`, CommentController.updateComment);
router.delete(`${routes.COMMENT}/:id`, CommentController.deleteComment);

router.get(routes.RESPONSES, CommentController.getResponses);

router.post(routes.CHAT, ChatController.connect);

router.post(routes.SUBSCRIBERS, SubscribersController.subscribe);
router.delete(routes.SUBSCRIBERS, SubscribersController.unsubscribe);
router.get(routes.SUBSCRIBERS, SubscribersController.getSubscribers);
router.get(routes.SUBSCRIBE, SubscribersController.checkSubscribe);
router.get(routes.FEEDS, SubscribersController.getFeeds);

router.get(routes.SEARCH, SearchController.search);

router.get(routes.POSTS_TAG, PostController.getPostsByTag);
router.get(routes.TOPIC, PostController.getRecomendedTopic);
router.get(routes.RECOMENDATIONS, PostController.getRecomendedPosts);

export default router;
