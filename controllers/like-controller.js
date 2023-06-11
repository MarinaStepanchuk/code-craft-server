import LikeService from '../services/like-service.js';

export default class LikeController {
  static async likePost(req, res, next) {
    try {
      const { userId, postId } = req.query;
      const result = await LikeService.addLike(userId, postId);
      console.log(result);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
  static async removeLike(req, res, next) {
    try {
      const { userId, postId } = req.body;
      const result = await LikeService.removeLike(userId, postId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
