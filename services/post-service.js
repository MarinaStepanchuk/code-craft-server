import Post from '../db/models/post.js';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import User from '../db/models/user.js';
import Tag from '../db/models/tag.js';

export default class PostService {
  static async create({ title, content, banner, tags, status, creatorId }) {
    const data = {
      title,
      content,
      banner,
      viewCount: 0,
      status,
      UserId: creatorId,
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
        'updatedAt',
        'UserId',
      ],
      include: [
        {
          model: Tag,
          as: 'Tags',
          attributes: ['id', 'name'],
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
        'updatedAt',
        'UserId',
      ],
      include: [
        {
          model: Tag,
          as: 'Tags',
          attributes: ['id', 'name'],
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
    // console.log(a);
    // const tags = await Tag.getAll({
    //   where: {},
    // });

    // console.log(tags);

    for (const tag of tags) {
      if (tag.count > 1) {
        await tag.decrement('count');
      } else {
        const b = await Tag.destroy({
          where: {
            id: tag.id,
          },
        });
        console.log(b);
      }
    }

    // const c = await Promise.all(
    //   tags.forEach(async (tag) => {
    //     console.log(tag.id);

    //   })
    // );

    console.log(33333);

    const post = await Post.destroy({
      where: {
        id: id,
      },
    });

    if (!post) throw ApiError.NotFound(errorsObject.notFound);

    return true;
  }

  static async getUserPosts({ userId, status }) {
    try {
      const data = await Post.findAll({
        where: {
          UserId: userId,
          status: status,
        },
        attributes: [
          'id',
          'title',
          'content',
          'banner',
          'viewCount',
          'updatedAt',
          'UserId',
        ],
        include: [
          {
            model: Tag,
            as: 'Tags',
            attributes: ['id', 'name'],
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
        where: { status: status },
        order: [['updatedAt', sort]],
        limit: limit,
        offset: offset,
      });

      if (data.length === 0) return [];

      const posts = await Promise.all(
        data.map(async (item) => {
          const user = await User.findByPk(item.UserId);
          if (user) {
            return {
              post: {
                id: item.id,
                title: item.title,
                content: item.content,
                banner: item.banner,
                tags: JSON.parse(item.tags),
                viewCount: item.viewCount,
                updatedDate: item.updatedAt,
                UserId: item.UserId,
              },
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                twitter: user.twitter,
                mail: user.mail,
                instagram: user.instagram,
              },
            };
          } else {
            return;
          }
        })
      );
      return posts;
    } catch (error) {
      console.log(error);
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }

  static async getPost(id) {
    const data = await Post.findByPk(id, {
      attributes: [
        'id',
        'title',
        'content',
        'banner',
        'viewCount',
        'updatedAt',
        'UserId',
      ],
      include: [
        {
          model: Tag,
          as: 'Tags',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!data) throw ApiError.NotFound(errorsObject.notFound);

    return data;
  }
}
