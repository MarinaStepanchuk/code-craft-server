import PostService from '../services/post-service.js';
import { errorsObject } from '../utils/constants.js';
import ApiError from '../utils/api-error.js';
import FirebaseService from '../services/firebase-service.js';
import sharp from 'sharp';

export default class PostController {
  static async saveImage(req, res, next) {
    try {
      if (!req.file) {
        return res.json(null);
      }

      switch (req.file.mimetype) {
        case 'image/jpeg':
          req.file.buffer = await sharp(req.file.buffer)
            .jpeg({
              quality: 70,
            })
            .withMetadata()
            .toBuffer();
          break;
        case 'image/png':
          req.file.buffer = await sharp(req.file.buffer)
            .png({ palette: true })
            .toBuffer();
          break;
        case 'image/webp':
          req.file.buffer = await sharp(req.file.buffer, { animated: true })
            .webp({ effort: 6 })
            .toBuffer();
          break;
        default:
          break;
      }

      const url = await FirebaseService.saveFile(req.file);
      return res.json(url);
    } catch (error) {
      next(error);
    }
  }

  static async removeImages(req, res, next) {
    try {
      const images = req.body;

      if (images.length === 0) {
        return res.json(null);
      }

      images.forEach(async (image) => {
        await FirebaseService.removeImage(image);
      });
      res.json(null);
    } catch (error) {
      res.json(null);
    }
  }

  static async createPost(req, res, next) {
    try {
      const { creatorId, title, content, tags, status } = req.body;
      const bannerUrl = req.file
        ? await FirebaseService.saveFile(req.file)
        : null;
      const doc = {
        title,
        content,
        banner: bannerUrl,
        tags: JSON.parse(tags),
        creatorId,
        status,
      };
      const result = await PostService.create(doc);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req, res, next) {
    try {
      const { id, title, content, tags, status, banner } = req.body;
      const bannerUrl = req.file
        ? await FirebaseService.saveFile(req.file)
        : null;
      const doc = {
        id,
        title,
        content,
        banner: banner || bannerUrl,
        tags: JSON.parse(tags),
        status,
      };
      const result = await PostService.update(doc);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req, res, next) {
    try {
      const result = await PostService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getPosts(req, res, next) {
    try {
      if (req.query.userId) {
        const { userId, status = 'published' } = req.query;
        const result = await PostService.getUserPosts({ userId, status });
        res.json(result);
      }

      const {
        limit = 20,
        offset = 0,
        sort = 'DESC',
        status = 'published',
      } = req.query;

      const result = await PostService.getPosts({
        limit,
        offset,
        sort,
        status,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getPostById(req, res, next) {
    try {
      const result = await PostService.getPost(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getDraft(req, res, next) {
    try {
      const result = await PostService.getDraft(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async visitPost(req, res, next) {
    try {
      const result = await PostService.visitPost(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getBookmarks(req, res, next) {
    try {
      const { userId } = req.query;
      const result = await PostService.getBookmarks(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
