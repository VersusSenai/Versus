import jwt from 'jsonwebtoken';
import 'dotenv/config';
import util from '../services/util.js';


const isAdmin = async (req, res, next) => {

    const {token }= req.cookies

    await jwt.verify(
        token,
        process.env.JWT_SECRET, 
        async (err, authData) => {
            if (err) {
                res.sendStatus(403)
                return 0;
            }
            if(authData){
                req.user = await util.getUserByToken(req)
                if(req.user.role == "A"){
                    next()

                }else{
                    res.status(401)
                    .json({msg: "User is not a Admin"})
                }
            }
        })


};

export default isAdmin;