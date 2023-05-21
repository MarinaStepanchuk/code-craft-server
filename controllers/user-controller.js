import UserService from "../services/user-service.js";
import { validationResult } from 'express-validator';
import ApiError from "../utils/api-error.js";

export default class UserController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map((error) => error.msg);
        return next(ApiError.BadRequest('Validation error', errorsMessages));
      }

      const result = await UserService.register(email, password);

      res.cookie('refreshToken', result.user.refreshToken, { maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true });
      return res.json(result.user)

    } catch(error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password)

      if (result.code === 200) {
        return res.json(result.user)
      }

      return res.status(result.code).json(result);
    } catch(error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password)

      if (result.code === 200) {
        return res.json(result.user)
      }

      return res.status(result.code).json(result);
    } catch(error) {
      next(error);
    }
  }

  static async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink)
      return res.redirect('http://localhost:3000')
    } catch(error) {
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password)

      if (result.code === 200) {
        return res.json(result.user)
      }

      return res.status(result.code).json(result);
    } catch(error) {
      next(error);
    }
  }

  static async getMe (req, res, next) {
    try {
      const result = await UserService.getUser(req.userId);

      if (result.code === 200) {
        return res.json(result.user);
      } 
      
      return res.status(result.code).json(result);
    } catch(error) {
      next(error);
    }
  }

  static async getUser (req, res, next) {
    try {
      const result = await UserService.getUser(req.params.userId);

      if (result.code === 200) {
        return res.json(result.user)
      }

      return res.status(result.code).json(result);
    } catch(error) {
      next(error);
    }
  }
}