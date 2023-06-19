import Subscribers from '../db/models/subscribers.js';
import User from '../db/models/user.js';
import Post from '../db/models/post.js';

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

  static async getSubscribers({ author, page }) {
    const limit = 20;
    const subscribers = await Subscribers.findAll({
      where: { author },
      limit,
      offset: limit * page,
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
      page,
      amountPages: Math.ceil(count / limit) - 1,
      amountSubscribers: count,
    };
  }

  static async getFeeds({ userId, page }) {
    const limit = 20;
    const feeds = await Subscribers.findAll({
      where: { subscriber: userId },
      limit,
      offset: limit * page,
    });

    const feedsData = await Promise.all(
      feeds.map(
        async (item) =>
          await Post.findAll({
            where: {
              userId: item.author,
              status: 'published',
            },
            attributes: [
              'id',
              'title',
              'content',
              'banner',
              'viewCount',
              ['updatedAt', 'updatedDate'],
              ['createdAt', 'createdDate'],
              'userId',
            ],
            include: [
              {
                model: User,
                attributes: ['id', 'email', 'name', 'avatarUrl'],
              },
            ],
          })
      )
    );

    if (!feedsData.length) {
      return {
        posts: [],
        page: 0,
      };
    }

    const sortData = feedsData
      .flat()
      .sort(
        (dateA, dateB) =>
          new Date(dateA.updatedDate).getTime() -
          new Date(dateB.updatedDate).getTime()
      );

    const result = sortData.slice(page * limit, page * limit + limit);

    return {
      posts: [...result],
      page,
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
