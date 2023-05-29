import { errorsObject } from "./constants.js";

export default class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, errorsObject.unauthorizedUser);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message) {
    return new ApiError(404, message);
  }

  static LoadingError(message) {
    return new ApiError(500, message);
  }
}