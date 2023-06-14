import UserService from '../services/user-service.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import FirebaseService from '../services/firebase-service.js';

export default class UserController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map((error) => error.msg);
        next(ApiError.BadRequest(errorsObject.validation, errorsMessages));
      }

      const result = await UserService.register(email, password);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      const result = await UserService.getUser(req.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req, res, next) {
    try {
      const result = await UserService.getUser(req.params.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getUserByEmail(req, res, next) {
    try {
      const result = await UserService.getUserByEmail(
        decodeURIComponent(req.params.email)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { id, name, bio, twitter, mail, instagram } = req.body;
      let avatarUrl = req.file
        ? await FirebaseService.saveFile(req.file)
        : null;
      const result = await UserService.updateUser({
        id,
        name,
        bio,
        twitter,
        mail,
        instagram,
        avatarUrl,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async registerWithProvider(req, res, next) {
    try {
      const { id, email, avatarUrl, provider } = req.body;
      const result = await UserService.registerWithProvider(
        id,
        decodeURIComponent(email),
        avatarUrl,
        provider
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateBookmarks(req, res, next) {
    try {
      const { bookmarks, userId } = req.body;
      const result = await UserService.updateBookmark({ bookmarks, userId });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
