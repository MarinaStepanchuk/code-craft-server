const routes = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  ACTIVATE: '/activate/:link',
  REFRESH: '/refresh',
  ME: '/me',
  USER: '/user/:userId',
  USER_UPDATE: '/user',
  POSTS: '/posts',
  POST: '/post',
  POST_BY_ID: '/post/:id',
  REGISTER_PROVIDER: '/register-provider',
  USER_BY_EMAIL: '/user/email/:email',
  SAVE_IMAGE: '/save-image',
  REMOVE_IMAGES: '/remove-images',
};

const errorsObject = {
  validation: 'Validation error',
  serverError: 'Server error',
  unauthorizedUser: 'User is not authorized',
  userIsExist: 'A user with this email address already exists',
  incorrectLink: 'Incorrect activation link',
  unregisteredUser: 'User is not registered',
  incorrectLogin: 'Incorrect login or password',
  notFoundUser: 'User is not found',
  confirmEmail: 'You have not confirmed your email address.',
  incorrectData: 'Incorrect data',
  failedLoadImage: 'Failed to load image',
  notFound: 'data not found',
};

export { routes, errorsObject };
