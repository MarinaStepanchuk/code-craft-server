const routes = {
  LOGIN: '/login',
  REGISTER: '/register',
  ACTIVATE: '/activate/:link',
  ME: '/me',
  USER: '/user/:userId',
  USER_UPDATE: '/user',
  POSTS: '/posts',
  POSTS_TAG: '/posts/tag/:name',
  RECOMENDATIONS: '/posts/recomendation',
  POST: '/post',
  VISIT: '/post/visit/:id',
  POST_BY_ID: '/post/:id',
  POST_DRAFT: '/post/draft/:id',
  REGISTER_PROVIDER: '/register-provider',
  USER_BY_EMAIL: '/user/email/:email',
  SAVE_IMAGE: '/save-image',
  REMOVE_IMAGES: '/remove-images',
  LIKE: '/like',
  COUNT_LIKES: '/likes',
  BOOKMARKS: '/bookmarks',
  COMMENTS: '/comments',
  COMMENT: '/comment',
  RESPONSES: '/responses',
  CHAT: '/chat',
  SUBSCRIBERS: '/subscribers',
  FEEDS: '/subscribers/feeds',
  SUBSCRIBE: '/subscribe',
  SEARCH: '/search',
  TOPIC: '/tags/topic',
  NOTIFICATION: '/notification',
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
