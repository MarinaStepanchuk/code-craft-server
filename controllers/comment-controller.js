import CommentService from '../services/comment-service.js';

export default class CommentController {
  static async createComment(req, res, next) {
    try {
      const { userId, postId, message, parentId } = req.body;
      const result = await CommentService.create({
        userId,
        postId,
        message,
        parentId,
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateComment(req, res, next) {
    try {
      const { message } = req.body;
      const id = req.params.id;
      const result = await CommentService.update({ id, message });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req, res, next) {
    try {
      const result = await CommentService.delete(req.params.id);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getComments(req, res, next) {
    try {
      const { postId } = req.query;
      const result = await CommentService.getAllComments(postId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getResponses(req, res, next) {
    try {
      const { limit = 10, page = 0, userId } = req.query;
      const result = await CommentService.getResponses({
        userId,
        limit: Number(limit),
        page: Number(page),
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
