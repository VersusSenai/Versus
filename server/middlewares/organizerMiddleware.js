import jwt from 'jsonwebtoken';
import 'dotenv/config';
import util from '../services/util.js';



const isOrganizer = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.sendStatus(403);

        jwt.verify(token, process.env.JWT_SECRET);
        req.user = await util.getUserByToken(req);
        if (req.user.role === 'A' || req.user.role === 'O') return next();
        return res.status(401).json({ msg: 'User is not a Event Organizer' });
    } catch (err) {
        return res.sendStatus(403);
    }
};

export default isOrganizer;