import UserService from '../services/user-service.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';

export default class UserController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map((error) => error.msg);
        return next(ApiError.BadRequest(errorsObject.validation, errorsMessages));
      }

      const result = await UserService.register(email, password);
      res.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true });
      return res.json(result);
    } catch(error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true });
      return res.json(result);
    } catch(error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch(error) {
      next(error);
    }
  }

  static async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch(error) {
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const result = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', result.refreshToken, { maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true });
      return res.json(result);
    } catch(error) {
      next(error);
    }
  }

  static async getMe (req, res, next) {
    try {
      const result = await UserService.getUser(req.userId);
      return res.json(result);
    } catch(error) {
      next(error);
    }
  }

  static async getUser (req, res, next) {
    try {
      const result = await UserService.getUser(req.params.userId);
      return res.json(result);
    } catch(error) {
      next(error);
    }
  }

  static async getUserByEmail (req, res, next) {
    try {
      const result = await UserService.getUserByEmail(decodeURIComponent(req.params.email));
      return res.json(result);
    } catch(error) {
      next(error);
    }
  }

  static async updateUser (req, res, next) {
    try {
      const form  = req.body;
      console.log(req.file)
      console.log(req.body)
      
      // const result = await UserService.updateUser(form);
      // return res.json(result);
      return res.json(form);
    } catch(error) {
      next(error);
    }
  }

  static async registerWithProvider (req, res, next) {
    try {
      const { id, email, avatarUrl, provider } = req.body;
      const result = await UserService.registerWithProvider(id, decodeURIComponent(email), avatarUrl, provider);
      return res.json(result);
    } catch(error) {
      next(error);
    }
  }
}
