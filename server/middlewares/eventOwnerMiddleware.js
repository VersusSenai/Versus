import jwt from 'jsonwebtoken';
import 'dotenv/config';
import util from '../services/util';


const isEventOwner = async (req, res, next) => {

    const {token }= req.cookies

    await jwt.verify(
        token,
        process.env.JWT_SECRET, 
        (err, authData) => {
            if (err) {
                res.sendStatus(403)
            }})

    req.user = await util.getUserByToken(req)
    
    const userInscription = await this.prisma.eventInscriptions.findFirst({where: {
          userId: req.user.id, eventId: parseInt(req.params.id)
    }})
    
    
    
    if(req.user.role == "A" || userInscription.role == "O"){
        next()

    }else{
        res.status(401)
        .json({msg: "User is not a Admin"})
    }
};

export default isEventOwner;