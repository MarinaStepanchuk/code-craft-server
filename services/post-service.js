import Post from '../db/models/post.js';

export default class PostService {
  static async create( data ) {
    const post = await Post.create(data);
    return post;
  }
}
