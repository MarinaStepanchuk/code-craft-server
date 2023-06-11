import Like from '../db/models/like.js';

export default class LikeService {
  static async addLike(userId, postId) {
    await Like.create({ userId, postId });
    return null;
  }

  static async removeLike(userId, postId) {
    await Like.destroy({
      where: { userId, postId },
    });
    return null;
  }

  static async checkUserLike(postId) {
    const isLiked = await Like.findOne({ where: { postId } });

    if (isLiked) {
      return true;
    }

    return false;
  }
}
