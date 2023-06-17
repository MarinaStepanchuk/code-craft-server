import SubscribersService from '../services/subscribers-service.js';

export default class SubscribersController {
  static async subscribe(req, res, next) {
    try {
      const { author, subscriber } = req.body;
      const result = await SubscribersService.addSubscribe({
        author,
        subscriber,
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
      const { author, offset } = req.query;
      const result = await SubscribersService.getSubscribers({
        author,
        offset: Number(offset) || 0,
      });
      return res.json(result);
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
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
