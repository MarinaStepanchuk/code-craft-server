import { Router } from 'express';
import { routes } from '../utils/constants.js';
import { registerValidation } from "../utils/validations.js";
import UserController from '../controllers/user-controller.js';

const router = Router();

router.post(routes.REGISTER, registerValidation, UserController.register);
router.post(routes.LOGIN, UserController.login);
router.get(routes.USERS, UserController.getUser);

export default router;