import ChatService from '../services/chat-service.js';

export default class ChatController {
  static async connect(req, res, next) {
    try {
      const { message } = req.body;
      console.log(req.body);
      const result = await ChatService.getMessage(message);
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
