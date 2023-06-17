import Post from '../db/models/post.js';
import Like from '../db/models/like.js';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import User from '../db/models/user.js';
import Tag from '../db/models/tag.js';
import LikeService from './like-service.js';
import sequelize from '../db/db.js';

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

  static async getUserPublishedPosts({ userId, limit, offset }) {
    try {
      const count = await Post.count({
        where: {
          userId: userId,
          status: 'published',
        },
      });
      const rows = await Post.findAll({
        where: {
          userId: userId,
          status: 'published',
        },
        order: [['updatedAt', 'DESC']],
        limit,
        offset: offset ? limit + offset - 1 : offset,
        attributes: [
          'id',
          'title',
          'content',
          'banner',
          'viewCount',
          ['updatedAt', 'updatedDate'],
          ['createdAt', 'createdDate'],
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

      const postsWithLikes = await Promise.all(
        rows.map(async (item) => {
          const likesCount = await item.countLikes();
          return {
            ...item.dataValues,
            likesCount,
          };
        })
      );

      if (!postsWithLikes.length)
        return {
          posts: [],
          page: 0,
          amountPages: 0,
          amountPosts: 0,
        };

      return {
        posts: [...postsWithLikes],
        page: offset,
        amountPages: Math.ceil(count / limit) - 1,
        amountPosts: count,
      };
    } catch (error) {
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }

  static async getUserDrafts({ userId, limit, offset }) {
    try {
      const count = await Post.count({
        where: {
          userId: userId,
          status: 'draft',
        },
      });
      const rows = await Post.findAll({
        where: {
          userId,
          status: 'draft',
        },
        order: [['updatedAt', 'DESC']],
        limit,
        offset: offset ? limit + offset - 1 : offset,
        attributes: [
          'id',
          'title',
          'content',
          'banner',
          'viewCount',
          ['updatedAt', 'updatedDate'],
          ['createdAt', 'createdDate'],
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

      if (rows.length === 0)
        return {
          posts: [],
          page: 0,
          amountPages: 0,
          amountPosts: 0,
        };

      return {
        posts: [...rows],
        page: offset,
        amountPages: Math.ceil(count / limit) - 1,
        amountPosts: count,
      };
    } catch (error) {
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }

  static async getPosts({ limit, offset, sort }) {
    try {
      const count = await Post.count({
        where: {
          status: 'published',
        },
      });
      const rows = await Post.findAll({
        where: { status: 'published' },
        order: [['createdAt', sort]],
        limit,
        offset: offset ? limit + offset - 1 : offset,
        attributes: [
          'id',
          'title',
          'content',
          'banner',
          'viewCount',
          ['updatedAt', 'updatedDate'],
          ['createdAt', 'createdDate'],
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

      if (rows.length === 0)
        return {
          posts: [],
          page: 0,
          amountPages: 0,
          amountPosts: 0,
        };

      return {
        posts: [...rows],
        page: offset,
        amountPages: Math.ceil(count / limit) - 1,
        amountPosts: count,
      };
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
        ['createdAt', 'createdDate'],
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
        ['createdAt', 'createdDate'],
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
    const countLikes = await data.countLikes();

    return { ...data.dataValues, isLiked, countLikes };
  }

  static async visitPost(id) {
    const post = await Post.findOne({ where: { id } });
    await post.increment('viewCount');
    return {};
  }

  static async getBookmarks(userId) {
    const bookmarks = await User.findByPk(userId, {
      attributes: ['bookmarks'],
    });

    if (!bookmarks) {
      return [];
    }

    const posts = await Promise.all(
      bookmarks.join(' ').map(
        async (postId) =>
          await Post.findOne({
            where: {
              id: postId,
            },
            attributes: [
              'id',
              'title',
              'content',
              'banner',
              'viewCount',
              ['updatedAt', 'updatedDate'],
              ['createdAt', 'createdDate'],
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
          })
      )
    );

    if (posts.length === 0) return [];

    return posts;
  }
}
