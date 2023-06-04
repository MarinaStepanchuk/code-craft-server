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
      return res.json(null);
    } catch (error) {
      return res.json(null);
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
        tags,
        creatorId,
        status,
      };
      const result = await PostService.create(doc);
      return res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getPosts(req, res, next) {
    try {
      const { userId, status } = req.query;
      const result = await PostService.getPosts({ userId, status });
      return res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
