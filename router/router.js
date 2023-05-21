import { Router } from 'express';
import { routes } from '../utils/constants.js';
import { registerValidation } from "../utils/validations.js";
import UserController from '../controllers/user-controller.js';
import PostController from '../controllers/post-controller.js'
import checkAuth from "../utils/checkAuth.js";

const router = Router();

router.get('/', () => {console.log(1)})
router.post(routes.REGISTER, registerValidation, UserController.register);
router.post(routes.LOGIN, UserController.login);
router.post(routes.LOGOUT, UserController.logout);
router.get(routes.ACTIVATE, UserController.activate);
router.get(routes.REFRESH, UserController.refresh);
router.get(routes.ME, checkAuth, UserController.getMe);
router.get(routes.USER, UserController.getUser);
router.post(routes.POSTS, PostController.createPost)

export default router;