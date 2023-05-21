const routes = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  ACTIVATE: '/activate/:link',
  REFRESH: '/refresh',
  ME: '/me',
  USER: '/user/:userId',
  POSTS: '/posts'
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
  confirmEmail: 'You have not confirmed your email address.'
};

export { routes, errorsObject };
