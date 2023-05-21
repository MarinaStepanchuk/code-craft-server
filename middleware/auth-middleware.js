import TokenService from '../services/token-service.js';
import ApiError from '../utils/api-error.js';

const authMiddleware = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(!token) {
      return next(ApiError.UnauthorizedError());
    }

    const decoded = TokenService.validateAccessToken(token);

    if(!decoded) {
      return next(ApiError.UnauthorizedError());
    }

    req.userId = decoded.id;
    next();
  } catch(error) {
    return next(ApiError.UnauthorizedError());
  }
}

export default authMiddleware;
