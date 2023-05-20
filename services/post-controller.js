import Post from "../db/models/post.js";

export default class PostService {
  static async create( data ) {
    try {
      const post = await Post.create(data);

      return post;
    } catch (error) {
      return {
        code: 500,
        message: 'Server error'
      }
    }
  }
}