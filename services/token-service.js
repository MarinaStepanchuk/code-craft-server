import jwt from "jsonwebtoken";
import Token from "../db/models/token.js";

export default class TokenService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, 'secret84jfs0345jlvaw', {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, 'secret567mhngbfv', {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken
    }
  }

  static async saveToken(userId, refreshToken) {
    
    const tokenData = await Token.findOne({ where: { user_id: userId } })

    if(tokenData) {
      await Token.update({ refreshToken: refreshToken }, {
        where: {
          user_id: userId
        }
      });
    }

    const token = await Token.create({ user_id: userId, refreshToken })

    return token;
  }
}