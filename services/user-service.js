import User from '../db/models/user.js';
import Post from '../db/models/post.js';
import Subscribers from '../db/models/subscribers.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from './mail-service.js';
import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';

export default class UserService {
  static async register(email, password) {
    const candidate = await User.findOne({ where: { email: email } });

    if (candidate) {
      throw ApiError.BadRequest(errorsObject.userIsExist);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const activationLink = uuidv4();
    const id = uuidv4();
    const doc = {
      id,
      email,
      activationLink,
      password: passwordHash,
    };
    const user = await User.create(doc);

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      twitter: user.twitter,
      mail: user.mail,
      instagram: user.instagram,
      bookmarks: user.bookmarks,
    };
  }

  static async activate(activationLink) {
    const user = await User.findOne({
      where: { activationLink },
    });

    if (!user) {
      throw ApiError.BadRequest(errorsObject.incorrectLink);
    }

    await User.update(
      { isActivated: true },
      {
        where: {
          activationLink,
        },
      }
    );
  }

  static async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw ApiError.BadRequest(errorsObject.unregisteredUser);
    }

    // if (!user.isActivated) {
    //   throw ApiError.BadRequest(errorsObject.confirmEmail);
    // }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw ApiError.BadRequest(errorsObject.incorrectLogin);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      twitter: user.twitter,
      mail: user.mail,
      instagram: user.instagram,
      bookmarks: user.bookmarks,
    };
  }

  static async getUser(id) {
    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'email',
        'name',
        'bio',
        'twitter',
        'instagram',
        'mail',
        'bookmarks',
        'avatarUrl',
      ],
    });

    const countPosts = await Post.count({
      where: {
        userId: id,
        status: 'published',
      },
    });

    const countFollowers = await Subscribers.count({ where: { author: id } });

    if (!user) {
      throw ApiError.NotFound(errorsObject.notFoundUser);
    }

    return {
      ...user.dataValues,
      countPosts: countPosts || 0,
      countFollowers: countFollowers || 0,
    };
  }

  static async getUserByEmail(email) {
    const user = await User.findOne(
      { where: { email: email } },
      {
        attributes: [
          'id',
          'email',
          'name',
          'bio',
          'twitter',
          'instagram',
          'mail',
          'bookmarks',
        ],
      }
    );

    if (!user) {
      throw ApiError.NotFound(errorsObject.notFoundUser);
    }

    return user;
  }

  static async updateUser(user) {
    const {
      id,
      name = null,
      avatarUrl = null,
      bio = null,
      twitter = null,
      mail = null,
      instagram = null,
    } = user;
    const result = await User.update(
      {
        name,
        avatarUrl,
        bio,
        twitter,
        mail,
        instagram,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (!result) {
      throw ApiError.BadRequest(errorsObject.incorrectData);
    }

    const updateUser = await User.findByPk(id, {
      attributes: [
        'id',
        'email',
        'name',
        'bio',
        'twitter',
        'instagram',
        'mail',
        'bookmarks',
      ],
    });

    return updateUser;
  }

  static async registerWithProvider(id, email, avatarUrl, provider) {
    const candidate = await User.findOne({ where: { email } });
    if (!candidate) {
      const idUser = provider === 'google' ? `google${id}` : `github${id}`;
      const doc = {
        id: idUser,
        email,
        avatarUrl,
        password: provider,
        isActivated: true,
      };

      const user = await User.create(doc);

      return {
        id: user.id,
        email: user.email,
        name: user.name | null,
        avatarUrl: user.avatarUrl | null,
        bio: user.bio | null,
        twitter: user.twitter | null,
        mail: user.mail | null,
        instagram: user.instagram | null,
      };
    }

    return {
      id: candidate.id,
      email: candidate.email,
      name: candidate.name | null,
      avatarUrl: candidate.avatarUrl | null,
      bio: candidate.bio | null,
      twitter: candidate.twitter | null,
      mail: candidate.mail | null,
      instagram: candidate.instagram | null,
    };
  }

  static async updateBookmark({ bookmarks, userId }) {
    const user = await User.update(
      {
        bookmarks,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    if (!user[0]) {
      throw ApiError.NotFound(errorsObject.notFoundUser);
    }

    const updateUser = await User.findByPk(userId, {
      attributes: [
        'id',
        'email',
        'name',
        'bio',
        'twitter',
        'instagram',
        'mail',
        'bookmarks',
      ],
    });

    return updateUser;
  }
}
