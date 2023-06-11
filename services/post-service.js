import Post from '../db/models/post.js';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import User from '../db/models/user.js';
import Tag from '../db/models/tag.js';
import LikeService from './like-service.js';

export default class PostService {
  static async create({ title, content, banner, tags, status, creatorId }) {
    const data = {
      title,
      content,
      banner,
      viewCount: 0,
      status,
      userId: creatorId,
    };

    const post = await Post.create(data);

    const tagsArray = await Promise.all(
      tags.map(async (element) => {
        const [row] = await Tag.findOrCreate({
          where: { name: element },
          defaults: {
            name: element,
            count: 0,
          },
        });
        await row.increment('count');
        return row;
      })
    );

    await post.addTags(tagsArray);

    const result = await Post.findByPk(post.id, {
      attributes: [
        'id',
        'title',
        'content',
        'banner',
        'viewCount',
        ['updatedAt', 'updatedDate'],
        'userId',
      ],
      include: [
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return result;
  }

  static async update({ id, title, content, banner, tags, status }) {
    const data = {
      title,
      content,
      banner,
      status,
    };
    const update = await Post.update(data, {
      where: { id },
    });

    if (!update[0]) {
      throw ApiError.BadRequest(errorsObject.incorrectData);
    }

    const newPost = await Post.findByPk(id);

    const tagsArray = await Promise.all(
      tags.map(async (element) => {
        const [row, created] = await Tag.findOrCreate({
          where: { name: element },
          defaults: {
            name: element,
            count: 0,
          },
        });

        if (created) {
          await row.increment('count');
        }

        return row;
      })
    );

    await newPost.addTags(tagsArray);

    const result = await Post.findByPk(newPost.id, {
      attributes: [
        'id',
        'title',
        'content',
        'banner',
        'viewCount',
        ['updatedAt', 'updatedDate'],
        'userId',
      ],
      include: [
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    return result;
  }

  static async delete(id) {
    const postRemove = await Post.findByPk(id, {
      include: {
        model: Tag,
      },
    });

    const tags = await postRemove.getTags();

    for (const tag of tags) {
      if (tag.count > 1) {
        await tag.decrement('count');
      } else {
        await Tag.destroy({
          where: {
            id: tag.id,
          },
        });
      }
    }

    const post = await Post.destroy({
      where: {
        id,
      },
    });

    if (!post) throw ApiError.NotFound(errorsObject.notFound);

    return true;
  }

  static async getUserPosts({ userId, status }) {
    try {
      const data = await Post.findAll({
        where: {
          userId,
          status,
        },
        attributes: [
          'id',
          'title',
          'content',
          'banner',
          'viewCount',
          ['updatedAt', 'updatedDate'],
          'userId',
        ],
        include: [
          {
            model: Tag,
            attributes: ['id', 'name'],
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (data.length === 0) return [];

      return data;
    } catch (error) {
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }

  static async getPosts({ limit, offset, sort, status }) {
    try {
      const data = await Post.findAll({
        where: { status },
        order: [['updatedAt', sort]],
        limit,
        offset,
        attributes: [
          'id',
          'title',
          'content',
          'banner',
          'viewCount',
          ['updatedAt', 'updatedDate'],
          'userId',
        ],
        include: [
          {
            model: Tag,
            attributes: ['id', 'name'],
            through: {
              attributes: [],
            },
          },
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'email', 'name', 'avatarUrl'],
          },
        ],
      });

      if (data.length === 0) return [];

      return data;
    } catch (error) {
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }

  static async getDraft(id) {
    const data = await Post.findByPk(id, {
      attributes: [
        'id',
        'title',
        'content',
        'banner',
        'viewCount',
        ['updatedAt', 'updatedDate'],
        'userId',
      ],
      include: [
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!data) throw ApiError.NotFound(errorsObject.notFound);

    return data;
  }

  static async getPost(id) {
    const data = await Post.findByPk(id, {
      attributes: [
        'id',
        'title',
        'content',
        'banner',
        'viewCount',
        ['updatedAt', 'updatedDate'],
        'userId',
      ],
      include: [
        {
          model: Tag,
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          attributes: ['id', 'email', 'name', 'avatarUrl'],
        },
      ],
    });

    if (!data) throw ApiError.NotFound(errorsObject.notFound);

    const isLiked = await LikeService.checkUserLike(id);
    data.isLiked = isLiked;

    data.countLikes = await data.countLikes();

    return data;
  }
}
