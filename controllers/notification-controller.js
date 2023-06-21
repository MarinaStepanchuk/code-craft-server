import NotificationService from '../services/notification-service.js';

export default class NotificationController {
  static async createNotification(req, res, next) {
    try {
      const { userId, message } = req.body;
      const result = await NotificationService.createNotification({
        userId,
        message,
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async removeNotification(req, res, next) {
    try {
      const { id, userId } = req.body;
      if (userId) {
        const result = await NotificationService.removeAllNotification(userId);
        return res.json(result);
      }
      const result = await NotificationService.removeNotification(id);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllNottifications(req, res, next) {
    try {
      const { userId, page } = req.query;
      const result = await NotificationService.getAllNottifications({
        userId,
        page: Number(page) || 0,
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async unsubscribe(req, res, next) {
    try {
      const { author, subscriber } = req.body;
      const result = await SubscribersService.removeSubscribe({
        author,
        subscriber,
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getSubscribers(req, res, next) {
    try {
      const { author, page } = req.query;
      const result = await SubscribersService.getSubscribers({
        author,
        page: Number(page) || 0,
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async checkSubscribe(req, res, next) {
    try {
      const { author, subscriber } = req.query;
      const result = await SubscribersService.isSubscribed({
        author,
        subscriber,
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getFeeds(req, res, next) {
    try {
      const { userId, page } = req.query;
      const result = await SubscribersService.getFeeds({ userId, page });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
