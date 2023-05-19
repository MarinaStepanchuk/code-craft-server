import jwt from "jsonwebtoken";
import User from "../db/models/user.js";
import bcrypt from 'bcrypt';

export default class UserService {
  static async register(email, password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt)
      const doc = {
        email,
        password: passwordHash
      }

      const user = await User.create(doc);

      const token = jwt.sign(
        {
          _id: user.dataValues.id
        },
        'secret84jfs0345jlvaw',
        {
          expiresIn: '30d'
        }
      )

      return {
        code: 200,
        user: {
          email: user.email,
          token
        }
      };
    } catch (error) {
      return {
        code: 400,
        message: error.errors[0].message
      }
    }
  }

  static async login(email, password) {
    try {
      const user = await User.findOne({ where: { email: email } })

      if (!user) {
        return {
          code: 404,
          message: 'User is not registered'
        }
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return {
          code: 400,
          message: 'Incorrect login or password'
        }
      }

      const token = jwt.sign(
        {
          _id: user._id
        },
        'secret84jfs0345jlvaw',
        {
          expiresIn: '30d'
        }
      )

      return {
        code: 200,
        user: {
          email: user.email,
          token
        }
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        message: 'Failed to log in'
      }
    }
  }

  static async getUser(id) {
    try {
      const user = await User.findByPk(id)

      if (!UserService) {
        return {
          code: 404,
          message: 'User is not found'
        }
      }

      const { password, createdAt, updatedAt, ...userData} = user.dataValues

      return {
        code: 200,
        user: {
          ...userData
        }
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        message: 'Server error'
      }
    }
  }
}