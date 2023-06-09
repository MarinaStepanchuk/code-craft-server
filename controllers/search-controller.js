import PostService from '../services/post-service.js';
import UserService from '../services/user-service.js';

export default class SearchController {
  static async search(req, res, next) {
    try {
      const { text, type, page } = req.query;
      switch (type) {
        case 'publications':
          const resultPublications = await PostService.searchPublications({
            text,
            page: Number(page),
          });
          return res.json(resultPublications);
          break;
        case 'users':
          const resultUsers = await UserService.searchUsers({
            text,
            page: Number(page),
          });
          return res.json(resultUsers);
          break;
        case 'tags':
          const resultTags = await PostService.searchTags({
            text,
            page: Number(page),
          });
          return res.json(resultTags);
          break;
        default:
          break;
      }
    } catch (error) {
      next(error);
    }
  }
}
