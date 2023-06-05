import Post from '../db/models/post.js';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';

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

  static async getPosts({ userId, status }) {
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
          tags: JSON.parse(data.tags),
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

  static async getPost(id) {
    const data = await Post.findByPk(id);
    console.log(Array.isArray(data.tags));
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
