import PostService from '../services/post-service.js';

export default class PostController {
  static async createPost (req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map((error) => error.msg);
        return next(ApiError.BadRequest('Validation error', errorsMessages));
      }

      const { title, text, banner, tags } = req.body;
      const user = req.user_id;
      const doc = { title, text, banner, tags, user };
      const post = await PostService.create(doc);
      return res.json(post);
    } catch(error) {
      next(error);
    }
  }
}
