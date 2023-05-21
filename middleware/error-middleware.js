import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors});
  }

  return res.status(500).json({message: errorsObject.serverError});
}

export default errorMiddleware;
