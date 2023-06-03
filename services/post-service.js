import Post from '../db/models/post.js';

export default class PostService {
  static async create({
    title,
    content,
    banner,
    date,
    tags,
    published,
    userId: creatorId,
  }) {
    const data = {
      title,
      content,
      tags,
      banner,
      date,
      viewCount: 0,
      published,
      UserId: creatorId,
    };
    const post = await Post.create(data);
    return post;
  }
}
