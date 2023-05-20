import PostService from "../services/post-controller.js";

export default class PostController {
  static async createPost (req, res, next) {
    try {
      const { title, text, banner, tags } = req.body;
      const user = req.user_id;

      const doc = { title, text, banner, tags, user }
      const post = await PostService.create(doc)

      return res.json(result.post)
    } catch(error) {
      res.status(500).json({
        code: 500,
        message: 'Failed to register'
      })
    }
  }
}