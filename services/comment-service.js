import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import User from '../db/models/user.js';
import Comment from '../db/models/comment.js';
import Post from '../db/models/post.js';

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

    const children = await Comment.findAll({
      where: {
        parentId: id,
      },
    });

    if (children & (children.length > 0)) {
      await Promise.allSettled(
        children.forEach(async (element) => {
          await Comment.destroy({
            where: {
              id: element.id,
            },
          });
        })
      );
    }

    return {};
  }

  static async getAllComments(postId) {
    try {
      const result = await Comment.findAll({
        where: {
          postId,
        },
        attributes: [
          'id',
          'message',
          'parentId',
          'postId',
          ['createdAt', 'createdDate'],
          ['updatedAt', 'updatedDate'],
        ],
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

  static async getResponses({ userId, limit, page }) {
    const result = await Comment.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset: page ? limit * page - 1 : page,
      attributes: [
        'id',
        'message',
        'parentId',
        'postId',
        ['createdAt', 'createdDate'],
        ['updatedAt', 'updatedDate'],
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
        {
          model: Post,
          attributes: ['banner'],
        },
      ],
    });

    if (result.length === 0) return [];

    return {
      comments: [...result],
      page,
      amountPages: Math.ceil(result.length / limit),
    };
  }
}
