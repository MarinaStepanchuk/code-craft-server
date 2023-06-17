import Subscribers from '../db/models/subscribers.js';
import User from '../db/models/user.js';

export default class SubscribersService {
  static async addSubscribe({ author, subscriber }) {
    await Subscribers.create({ author, subscriber });
    return {};
  }

  static async removeSubscribe({ author, subscriber }) {
    await Subscribers.destroy({
      where: { author, subscriber },
    });
    return {};
  }

  static async getSubscribers({ author, offset }) {
    const limit = 20;
    const subscribers = await Subscribers.findAll({
      where: { author },
      limit,
      offset: offset ? limit + offset - 1 : offset,
    });

    const count = await Subscribers.count({
      where: { author },
    });

    const subscribersData = await Promise.all(
      subscribers.map(
        async (item) =>
          await User.findByPk(item.subscriber, {
            attributes: ['id', 'email', 'name', 'bio', 'avatarUrl'],
          })
      )
    );

    if (!subscribersData.length) {
      return {
        subscribers: [],
        page: 0,
        amountPages: 0,
        amountSubscribers: 0,
      };
    }

    return {
      subscribers: [...subscribersData],
      page: offset,
      amountPages: Math.ceil(count / limit) - 1,
      amountSubscribers: count,
    };
  }

  static async isSubscribed({ author, subscriber }) {
    const isSubscribed = await Subscribers.findOne({
      where: {
        author,
        subscriber,
      },
    });

    return !!isSubscribed;
  }
}
