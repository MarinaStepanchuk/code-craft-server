import User from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from './mail-service.js';
import TokenService from './token-service.js';
import ApiError from '../utils/api-error.js';

export default class UserService {
  static async register(email, password) {
    const candidate = await User.findOne({ where: { email: email } });

    if(candidate) {
      throw ApiError.BadRequest('A user with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const activationLink = uuidv4();
    const doc = {
      email,
      activationLink: activationLink,
      password: passwordHash
    };
    const user = await User.create(doc);
    await mailService.sendActivationMail(email, `http:/localhost:3001/api/activate/${activationLink}`);
    const tokens = TokenService.generateTokens({email, passwordHash, id: user.dataValues.id});
    await TokenService.saveToken(user.dataValues.id, tokens.refreshToken);
    return {
      email: user.email,
      ...tokens
    };
  }

  static async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink: activationLink } });

    if (!user) {
      throw ApiError.BadRequest('Incorrect activation link');
    }

    await User.update({ isActivated: true }, {
      where: {
        activationLink: activationLink
      }
    });
  }

  static async login(email, password) {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      throw ApiError.BadRequest('User is not registered');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw ApiError.BadRequest('Incorrect login or password');
    }

    const tokens = TokenService.generateTokens({email, password: user.password, id: user.dataValues.id});
    await TokenService.saveToken(user.dataValues.id, tokens.refreshToken);

    return {
      email: user.email,
      ...tokens
    };
  }

  static async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  static async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const user = TokenService.validateRefreshToken(refreshToken);
    const tokenBD = await TokenService.findToken(refreshToken);

    if(!user || !tokenBD) {
      throw ApiError.UnauthorizedError()
    }

    const tokens = TokenService.generateTokens({email: user.email, password: user.password, id: user.dataValues.id});
    await TokenService.saveToken(user.dataValues.id, tokens.refreshToken);
    return {
      email: user.email,
      ...tokens
    };
  }

  static async getUser(id) {
    const user = await User.findByPk(id)

    if (!UserService) {
      throw ApiError.NotFound('User is not found');
    }

    const { password, createdAt, updatedAt, ...userData} = user.dataValues;
    return { ...userData };
  }
}
