import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import User from '../db/models/user.js';
import Comment from '../db/models/comment.js';

export default class CommentService {
  static async create({ userId, postId, message, parentId }) {
    const data = postId
      ? {
          parentId,
          message,
          postId,
          userId,
        }
      : {
          message,
          postId,
          userId,
        };

    const comment = await Comment.create(data);

    const result = await Comment.findByPk(comment.id, {
      attributes: ['id', 'message', 'parentId', ['createdAt', 'createdDate']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
      ],
    });

    return result;
  }

  static async update({ id, message }) {
    const update = await Comment.update(
      { message },
      {
        where: { id: id },
      }
    );

    if (!update[0]) {
      throw ApiError.BadRequest(errorsObject.incorrectData);
    }

    const result = await Comment.findByPk(id, {
      attributes: ['id', 'message', 'parentId', ['createdAt', 'createdDate']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
      ],
    });

    return result;
  }

  static async delete(id) {
    const comment = await Comment.destroy({
      where: {
        id,
      },
    });

    if (!comment) throw ApiError.NotFound(errorsObject.notFound);

    return {};
  }

  static async getAllComments(postId) {
    try {
      const result = await Comment.findAll({
        where: {
          postId,
        },
        attributes: ['id', 'message', 'parentId', ['createdAt', 'createdDate']],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email', 'avatarUrl'],
          },
        ],
      });

      if (result.length === 0) return [];

      return result;
    } catch (error) {
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }
}
