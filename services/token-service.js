import jwt from 'jsonwebtoken';
import Token from '../db/models/token.js';

export default class TokenService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken
    };
  }

  static validateAccessToken(token) {
    try {
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return user;
    } catch(error) {
      return null;
    }
  }

  static validateRefreshToken(token) {
    try {
      const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return user;
    } catch(error) {
      return null;
    }
  }

  static async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { UserId: userId } });

    if(tokenData) {
      await Token.update({ refreshToken: refreshToken }, {
        where: {
          id: userId
        }
      });
      return tokenData;
    }
  
    const token = await Token.create({ refreshToken: refreshToken, UserId: userId });
    return token;
  }

  static async removeToken(refreshToken) {
    const tokenData = await Token.destroy({
      where: {
        refreshToken: refreshToken
      }
    });
    return tokenData;
  }

  static async findToken(refreshToken) {
    const tokenData = await Token.findOne({
      where: {
        refreshToken: refreshToken
      }
    });
    return tokenData;
  }
}
