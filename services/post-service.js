import Post from '../db/models/post.js';

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
    console.log(data);
    const post = await Post.create(data);
    return post;
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
          id: item.dataValues.id,
          title: item.dataValues.title,
          content: item.dataValues.content,
          banner: item.dataValues.banner,
          tags: JSON.parse(item.dataValues.tags),
          viewCount: item.dataValues.viewCount,
          updatedDate: item.dataValues.updatedAt,
          UserId: item.dataValues.UserId,
        };
      });
      return posts;
    } catch (error) {
      throw ApiError.NotFound(errorsObject.notFound);
    }
  }
}
