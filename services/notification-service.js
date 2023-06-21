import Notification from '../db/models/notification.js';

export default class NotificationService {
  static async createNotification({ userId, message }) {
    const notification = await Notification.create({ userId, message });
    return notification;
  }

  static async removeNotification(id) {
    await Notification.destroy({
      where: { id },
    });
    return {};
  }

  static async removeAllNotification(userId) {
    await Notification.destroy({
      where: { userId },
    });
    return {};
  }

  static async getAllNottifications({ userId, page }) {
    const limit = 20;

    const count = await Notification.count({
      where: {
        userId,
      },
    });

    const notifications = await Notification.findAll({
      where: { userId },
      limit,
      offset: limit * page,
      attributes: ['id', 'message'],
    });

    if (!notifications.length) {
      return {
        notification: [],
        page: 0,
        amountPages: 0,
        amountNotification: 0,
      };
    }

    return {
      notifications,
      page,
      amountPages: Math.ceil(count / limit) - 1,
      amountPosts: count,
    };
  }
}
