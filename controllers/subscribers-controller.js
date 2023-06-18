import SubscribersService from '../services/subscribers-service.js';

export default class SubscribersController {
  static async subscribe(req, res, next) {
    try {
      const { author, subscriber } = req.body;
      const result = await SubscribersService.addSubscribe({
        author,
        subscriber,
      });
      res.json(result);
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
      res.json(result);
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
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async checkSubscribe(req, res, next) {
    try {
      const { author, subscriber } = req.query;
      console.log(11111111111, author, subscriber);
      const result = await SubscribersService.isSubscribed({
        author,
        subscriber,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
