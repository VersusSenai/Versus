import jwt from 'jsonwebtoken';
import 'dotenv/config';


const verifyToken = (req, res, next) => {

    const {token }= req.cookies

    jwt.verify(
        token,
        process.env.JWT_SECRET, 
        (err, authData) => {
            if (err) {
                res.sendStatus(403)
            }else{
                next()
            }
        }
    )
};

export default verifyToken;