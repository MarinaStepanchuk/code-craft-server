import PostService from '../services/post-service.js';
import { errorsObject } from '../utils/constants.js';
import FirebaseService from '../services/firebase-service.js';
import sharp from 'sharp';

export default class PostController {
  static async saveImage (req, res, next) {
    try {
      if(!req.file) {
        return res.json(null)
      }

      switch(req.file.mimetype) {
        case 'image/jpeg':
          req.file.buffer = await sharp(req.file.buffer)
            .jpeg({
              quality: 70
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
    } catch(error) {
      next(error);
    }
  }

  static async createPost (req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map((error) => error.msg);
        return next(ApiError.BadRequest(errorsObject.validation, errorsMessages));
      }

      const { title, text, banner, tags } = req.body;
      const user = req.userId;
      const doc = { title, text, banner, tags, user };
      const post = await PostService.create(doc);
      return res.json(post);
    } catch(error) {
      next(error);
    }
  }
}
