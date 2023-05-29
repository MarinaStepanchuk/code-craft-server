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
      id,
      email,
      activationLink: activationLink,
      password: passwordHash
    };
    const user = await User.create(doc)
    
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const tokens = TokenService.generateTokens({email, passwordHash, id: user.id});
    await TokenService.saveToken(user.id, tokens.refreshToken);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      twitter: user.twitter,
      mail: user.mail,
      instagram: user.instagram,
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
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      twitter: user.twitter,
      mail: user.mail,
      instagram: user.instagram,
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
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      twitter: user.twitter,
      mail: user.mail,
      instagram: user.instagram,
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

  static async getUserByEmail(email) {
    const user = await User.findOne(({ where: { email: email } }))

    if (!user) {
      throw ApiError.NotFound(errorsObject.notFoundUser);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      twitter: user.twitter,
      mail: user.mail,
      instagram: user.instagram
    }
  }

  static async updateUser(user) {
    try {
      const {id, name = null, avatarUrl = null, bio = null, twitter = null, mail = null, instagram  = null} = user;
      const result = await User.update({
        name: name,
        avatarUrl: avatarUrl,
        bio: bio,
        twitter: twitter,
        mail: mail,
        instagram: instagram
      }, {
        where: {
          id: id
        }
      })
  
      if(!result) {
        throw ApiError.BadRequest(errorsObject.incorrectData);
      }
  
      const updateUser = await User.findByPk(id)
  
      return {
        id: updateUser.id,
        email: updateUser.email,
        name: updateUser.name,
        avatarUrl: updateUser.avatarUrl,
        bio: updateUser.bio,
        twitter: updateUser.twitter,
        mail: updateUser.mail,
        instagram: updateUser.instagram
      }
    } catch (error) {
      console.log(error)
    }
  }

  static async registerWithProvider(id, email, avatarUrl, provider) {
    const candidate = await User.findOne(({ where: { email: email } }));
    if(!candidate) {
      const idUser = provider === 'google' ? `google${id}` : `github${id}`;
      const doc = {
        id: idUser,
        email,
        avatarUrl,
        password: provider,
        isActivated: true
      };

      const user = await User.create(doc);
      
      return {
        id: user.id,
        email: user.email,
        name: user.name | null,
        avatarUrl: user.avatarUrl | null,
        bio: user.bio | null,
        twitter: user.twitter | null,
        mail: user.mail | null,
        instagram: user.instagram | null
      }
    }

    return {
      id: candidate.id,
      email: candidate.email,
      name: candidate.name | null,
      avatarUrl: candidate.avatarUrl | null,
      bio: candidate.bio | null,
      twitter: candidate.twitter | null,
      mail: candidate.mail | null,
      instagram: candidate.instagram | null
    }
  }
}
