import Like from '../db/models/like.js';

export default class LikeService {
  static async addLike(userId, postId) {
    await Like.create({ userId, postId });
    return {};
  }

  static async removeLike(userId, postId) {
    await Like.destroy({
      where: { userId, postId },
    });
    return {};
  }

  static async checkUserLike({ postId, userId }) {
    const isLiked = await Like.findOne({ where: { postId, userId } });

    return !!isLiked;
  }

  static async countLikes(postId) {
    const countLikes = await Like.count({ where: { postId } });

    return countLikes;
  }
}
