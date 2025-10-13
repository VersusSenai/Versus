import jwt from 'jsonwebtoken';
import 'dotenv/config';
import util from '../services/util.js';


const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.sendStatus(403);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await util.getUserByToken(req);
    return next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

export default verifyToken;