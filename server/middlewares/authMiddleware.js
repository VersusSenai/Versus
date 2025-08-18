import jwt from 'jsonwebtoken';
import 'dotenv/config';
import util from '../services/util';


const verifyToken = async (req, res, next) => {

    const {token }= req.cookies
    if(token){
        await jwt.verify(
            token,
            process.env.JWT_SECRET, 
            async (err, authData) => {
                if (err) {
                    res.sendStatus(403)
                }
                if(authData){
                    req.user = await util.getUserByToken(req)
                }
            })
    
        next()

    }else{
        res.sendStatus(403)

    }

};

export default verifyToken;