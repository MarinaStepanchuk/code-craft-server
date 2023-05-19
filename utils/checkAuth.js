import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret84jfs0345jlvaw');
      req.userId = decoded._id;
      next();
    } catch(error) {
      return res.status(403).json({
        code: 403,
        message: 'No access'
      })
    }
    
  } else {
    return res.status(403).json({
      code: 403,
      message: 'No access'
    })
  }
}

export default checkAuth;