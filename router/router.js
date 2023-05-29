import { Router } from 'express';
import { routes } from '../utils/constants.js';
import { registerValidation, postCreateValidation } from '../utils/validations.js';
import UserController from '../controllers/user-controller.js';
import PostController from '../controllers/post-controller.js'
import authMiddleware from '../middleware/auth-middleware.js';
import multer from 'multer';

const router = Router();

const upload = multer({storage: multer.memoryStorage()})

router.post(routes.REGISTER, registerValidation, UserController.register);
router.post(routes.LOGIN, UserController.login);
router.post(routes.LOGOUT, UserController.logout);
router.get(routes.ACTIVATE, UserController.activate);
router.post(routes.REGISTER_PROVIDER, UserController.registerWithProvider)
router.get(routes.REFRESH, UserController.refresh);
router.get(routes.ME, UserController.getMe);
router.get(routes.USER, UserController.getUser);
router.get(routes.USER_BY_EMAIL, UserController.getUserByEmail);
router.put(routes.USER_UPDATE, upload.single('avatar'), UserController.updateUser)
router.post(routes.POSTS, postCreateValidation, PostController.createPost)

export default router;
