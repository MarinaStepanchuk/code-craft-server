import Post from '../db/models/post.js';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import User from '../db/models/user.js';
import Tag from '../db/models/tag.js';
import { Op } from 'sequelize';
import getRandomList from '../utils/getRandomList.js';
import getUniqueListById from '../utils/getUniqueDataById.js';

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

  static async getUserPublishedPosts({ userId, limit, page }) {
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
        offset: limit * page,
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
        page,
        amountPages: Math.ceil(count / limit) - 1,
        amountPosts: count,
      };
    } catch (error) {
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }

  static async getUserDrafts({ userId, limit, page }) {
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
        offset: limit * page,
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

      if (!rows.length)
        return {
          posts: [],
          page: 0,
          amountPages: 0,
          amountPosts: 0,
        };

      return {
        posts: [...rows],
        page,
        amountPages: Math.ceil(count / limit) - 1,
        amountPosts: count,
      };
    } catch (error) {
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }

  static async getPosts({ limit, page, sort }) {
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
        offset: limit * page,
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

      if (!rows.length) {
        return {
          posts: [],
          page: 0,
          amountPages: 0,
          amountPosts: 0,
        };
      }

      return {
        posts: [...rows],
        page,
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

    return { ...data.dataValues };
  }

  static async visitPost(id) {
    const post = await Post.findOne({ where: { id } });
    await post.increment('viewCount');
    return {};
  }

  static async getBookmarks({ userId, page }) {
    const limit = 20;
    const user = await User.findByPk(userId, {
      attributes: ['bookmarks'],
    });

    if (!user.bookmarks) {
      return {
        posts: [],
        page: 0,
      };
    }

    const posts = await Promise.all(
      user.bookmarks
        .trim()
        .split(' ')
        .reverse()
        .map(
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
                  model: User,
                  attributes: ['id', 'email', 'name', 'avatarUrl'],
                },
              ],
            })
        )
    );

    if (!posts.length) {
      return {
        posts: [],
        page: 0,
        amountPages: 0,
        amountPosts: 0,
      };
    }

    const result = posts.slice(page * limit, page * limit + limit);

    return {
      posts: result,
      page,
      amountPages: Math.ceil(posts.length / limit) - 1,
      amountPosts: posts.length,
    };
  }

  static async searchPublications({ text, page }) {
    const limit = 20;
    const count = await Post.count({
      title: {
        [Op.substring]: text,
      },
      status: 'published',
    });
    const posts = await Post.findAll({
      where: {
        title: {
          [Op.substring]: text,
        },
        status: 'published',
      },
      order: [['updatedAt', 'DESC']],
      limit,
      offset: limit * page,
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
          model: User,
          attributes: ['id', 'email', 'name', 'avatarUrl'],
        },
      ],
    });

    if (!posts.length) {
      return {
        posts: [],
        page: 0,
        amountPages: 0,
        amountPosts: 0,
      };
    }

    return {
      posts,
      page,
      amountPages: Math.ceil(count / limit) - 1,
      amountPosts: count,
    };
  }

  static async searchTags({ text, page }) {
    const limit = 50;
    const count = await Tag.count({
      name: {
        [Op.substring]: text,
      },
    });
    const tags = await Tag.findAll({
      where: {
        name: {
          [Op.substring]: text,
        },
      },
      limit,
      offset: limit * page,
      attributes: ['id', 'name'],
    });

    if (!tags.length) {
      return {
        tags: [],
        page: 0,
        amountPages: 0,
        amountTags: 0,
      };
    }

    return {
      tags,
      page,
      amountPages: Math.ceil(count / limit) - 1,
      amountTags: count,
    };
  }

  static async getPostsByTag({ name, page }) {
    const limit = 20;

    const tag = await Tag.findOne({ where: { name } });

    const count = await tag.countPosts();

    const posts = await tag.getPosts({
      limit,
      offset: limit * page,
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
      through: {
        attributes: [],
      },
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'name', 'avatarUrl'],
        },
      ],
    });

    if (!posts.length) {
      return {
        posts: [],
        page: 0,
        amountPages: 0,
        amountPosts: 0,
      };
    }

    return {
      posts,
      page,
      amountPages: Math.ceil(count / limit) - 1,
      amountPosts: count,
    };
  }

  static async getRecomendedTopics({ userId, count }) {
    const posts = await Post.findAll({
      where: { userId: userId, status: 'published' },
      include: [
        {
          model: Tag,
          attributes: ['id', 'name', 'count'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!posts.length) {
      return await PostService.getTopTopics(count);
    }

    const tags = [];
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.push(tag));
    });

    const uniqueTags = getUniqueListById(tags);

    if (tags.size < count) {
      const additionalTags = await PostService.getTopTopics(count);
      return getUniqueListById([...uniqueTags, ...additionalTags]);
    }

    if (uniqueTags.tagsArray.length === count) {
      return uniqueTags;
    }

    return getRandomList(uniqueTags.tagsArray, count);
  }

  static async getTopTopics(count) {
    const tags = await Tag.findAll({
      limit: count * 3,
      order: [['count', 'DESC']],
      attributes: ['id', 'name', 'count'],
    });

    if (!tags.length) {
      return [];
    }

    return getRandomList(tags, count);
  }

  static async getRecomendedList(count) {
    const posts = await Post.findAll({
      where: { status: 'published' },
      limit: 100,
      order: [['viewCount', 'DESC']],
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
          model: User,
          attributes: ['id', 'email', 'name', 'avatarUrl'],
        },
      ],
    });

    return getRandomList(posts, count);
  }
}
