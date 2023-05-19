import UserService from "../services/user-service.js";
import { validationResult } from 'express-validator';;

export default class UserController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json((errors.array()))
      }

      const result = await UserService.register(email, password)

      if (result.code === 200) {
        return res.json(result.user)
      }

      return res.status(result.code).json(result)
    } catch(error) {
      res.status(500).json({
        code: 500,
        message: 'Failed to register'
      })
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password)

      if (result.code === 200) {
        return res.json(result.user)
      }

      return res.status(result.code).json(result)
      
    } catch(error) {
      res.status(500).json({
        code: 500,
        message: 'Failed to log in'
      })
    }
  }

  static async getUser (req, res, next) {
    try {

    } catch(error) {
      
    }
  }
}