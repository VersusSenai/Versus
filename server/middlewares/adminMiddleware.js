import jwt from 'jsonwebtoken';
import 'dotenv/config';
import util from '../services/util';


const isAdmin = async (req, res, next) => {

    const {token }= req.cookies

    await jwt.verify(
        token,
        process.env.JWT_SECRET, 
        (err, authData) => {
            if (err) {
                res.sendStatus(403)
            }})

    req.user = await util.getUserByToken(req)
    if(req.user.role == "A"){
        next()

    }else{
        res.status(401)
        .json({msg: "User is not a Admin"})
    }
};

export default isAdmin;