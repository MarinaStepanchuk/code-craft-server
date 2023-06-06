import Post from '../db/models/post.js';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import User from '../db/models/user.js';

export default class PostService {
  static async create({ title, content, banner, tags, status, creatorId }) {
    const data = {
      title,
      content,
      tags,
      banner,
      viewCount: 0,
      status,
      UserId: creatorId,
    };
    const post = await Post.create(data);
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      banner: post.banner,
      tags: JSON.parse(post.tags),
      viewCount: post.viewCount,
      updatedDate: post.updatedAt,
      UserId: post.UserId,
    };
  }

  static async update({ id, title, content, banner, tags, status }) {
    const data = {
      title,
      content,
      tags,
      banner,
      viewCount: 0,
      status,
    };
    const newPost = await Post.update(data, {
      where: {
        id: id,
      },
    });

    return {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      banner: newPost.banner,
      tags: JSON.parse(newPost.tags),
      viewCount: newPost.viewCount,
      updatedDate: newPost.updatedAt,
      UserId: newPost.UserId,
    };
  }

  static async delete(id) {
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
      });

      if (data.length === 0) return [];

      const posts = data.map((item) => {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          banner: item.banner,
          tags: JSON.parse(item.tags),
          viewCount: item.viewCount,
          updatedDate: item.updatedAt,
          UserId: item.UserId,
        };
      });
      return posts;
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
    const data = await Post.findByPk(id);
    if (!data) throw ApiError.NotFound(errorsObject.notFound);

    const post = {
      id: data.id,
      title: data.title,
      content: data.content,
      banner: data.banner,
      tags: JSON.parse(data.tags),
      viewCount: data.viewCount,
      updatedDate: data.updatedAt,
      UserId: data.UserId,
    };

    return post;
  }
}
