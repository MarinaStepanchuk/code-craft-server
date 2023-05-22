import User from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from './mail-service.js';
import TokenService from './token-service.js';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';

export default class UserService {
  static async register(email, password) {
    const candidate = await User.findOne({ where: { email: email } });

    if(candidate) {
      throw ApiError.BadRequest(errorsObject.userIsExist);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const activationLink = uuidv4();
    const id = uuidv4();

    const doc = {
      user_id:id,
      email,
      activationLink: activationLink,
      password: passwordHash
    };
    const user = await User.create(doc)
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    const tokens = TokenService.generateTokens({email, passwordHash, id: user.dataValues.id});
    await TokenService.saveToken(user.dataValues.id, tokens.refreshToken);
    return {
      email: user.email,
      id: user.dataValues.id,
      ...tokens
    };
  }

  static async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink: activationLink } });

    if (!user) {
      throw ApiError.BadRequest(errorsObject.incorrectLink);
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
      throw ApiError.BadRequest(errorsObject.unregisteredUser);
    }

    // if (!user.isActivated) {
    //   throw ApiError.BadRequest(errorsObject.confirmEmail);
    // }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw ApiError.BadRequest(errorsObject.incorrectLogin);
    }

    const tokens = TokenService.generateTokens({email, password: user.password, id: user.dataValues.id});
    await TokenService.saveToken(user.dataValues.id, tokens.refreshToken);

    return {
      email: user.email,
      id: user.dataValues.id,
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

    if (!user) {
      throw ApiError.NotFound(errorsObject.notFoundUser);
    }

    const { password, createdAt, updatedAt, ...userData} = user.dataValues;
    return { ...userData };
  }

  static async registerWithGoogle(id, email) {
    const candidate = await User.findOne({ where: { user_id: id } });
    if(!candidate) {
      const doc = {
        email,
        user_id: id,
        password: 'google'
      };
      const user = await User.create(doc);

      return user.dataValues.email
    }

    return candidate.dataValues.email
  }
}
