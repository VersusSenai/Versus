import { PrismaClient } from '@prisma/client';
import serviceUtils from '../services/util.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import inviteModel from './inviteModel.js';
import DataBaseException from '../exceptions/DataBaseException.js';
import NotAllowedException from '../exceptions/NotAllowedException.js';
import ConflictException from '../exceptions/ConflictException.js';
import { pagination } from 'prisma-extension-pagination';


class TeamModel {
  
  constructor() {
    this.prisma = new PrismaClient().$extends(pagination());
  }

  getAll = async (req) => {
    let page = req.query.page? parseInt(req.query.page): 1;
    let limit =  req.query.limit? parseInt(req.query.limit): 10;
    let status = req.query.status? req.query.status : ["P", "O"];
    if(!Array.isArray(status)){
      status = [status]
    }
    if(limit > 30){
      limit = 30;
    }
    if(status.includes("B") && req.user.role != "A"){
      throw new NotAllowedException("Only administrators can see deleted teams");
    }

    return await this.prisma.team.paginate({
      where: {status: {in: status}}
    }).withPages({
      page, limit
    });
    
  };

  getById = async (req) => {
    if(req.user.role != "A"){
      const team = await this.prisma.team.findUnique({
        where: { id: Number(req.params.id) , status: {notIn: ['B']}},
      });
      if (!team) {
        throw new NotFoundException("Team not found");
      }
  
      return team;

    }else{
      const team = await this.prisma.team.findUnique({
        where: { id: Number(req.params.id)},
      });
      if (!team) {
        throw new NotFoundException("Team not found");
      }
  
      return team;  
    }

  };

  create = async (req) => {
    const userData = req.user;
    console.log(userData)
    const {name, description} = req.body;
    if(!name || !description){
      throw new BadRequestException("Missing required fields");
    }

    return await this.prisma.team.create({
      data: { name, description,status: "P" , teamUsers: {
        create: [
          {userId: userData.id, role: "O"}
        ]
      }},
    }).catch(e=>{
      console.log(e)
      throw new DataBaseException("Team not created");
      
    });
  };

  update = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    const {name, description} = req.body;


    const teamOwner = await this.isTeamOwner(userData, parseInt(req.params.id));
    if(!teamOwner){
      throw new NotAllowedException("You are not the owner of this team");
    }

    const team = await this.prisma.team.findFirst({ where: { id: parseInt(req.params.id), status: {in: ["O", "P"]}} });

    if (team == null) {
      throw new NotFoundException("Team not found");
    }

    if(!await this.isTeamOwner(userData, parseInt(req.params.id))){
      throw new NotAllowedException("You do not own this team");
      
    }

    return await this.prisma.team.update({
      where: { id: team.id},
      data: {
        name, description
      }
    }).catch(e=>{
      console.log(e)
      throw new DataBaseException("Failed to Update Team");
      
    });
  };

  delete = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    const teamOwner = await this.isTeamOwner(userData, parseInt(req.params.id))
    if(!teamOwner){
      throw new NotAllowedException("You are not the owner of this team");
    }

      return await this.prisma.team.update({ where: { id: parseInt(req.params.id) }, data:{ 
          status: "B"
        } 
      })
      .catch(e=>{
      if (e.code === 'P2025') {
        throw new NotFoundException("Team not found");
      }
      throw new DataBaseException("Internal Server Error");
    });

  };

  unsubscribe = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);

    const team = await this.prisma.team.findFirst({ where: { id: parseInt(req.params.id) } });

    if (team == null) {
      throw new NotFoundException("Team not found");
    }

    const userInscriptionByToken = await this.prisma.teamUsers.findFirst({
      where: {
        userId: userData.id,
        teamId: parseInt(req.params.id),
      }
    });

    if (userInscriptionByToken == null) {
      throw new NotFoundException("You are not inscribed in this team");
    }
    if(userInscriptionByToken.role == "O"){
      throw new NotAllowedException("The Owner cannot Unsubscribe himself");
    }

    if (userInscriptionByToken != null) {
      return await this.prisma.teamUsers.delete({ where: { id: userInscriptionByToken.id } });
    }

  
  };

  unsubscribeById = async (req)=>{
    const userData = req.user;

    const team = await this.prisma.team.findFirst({ where: { id: parseInt(req.params.id) } });

    if (team == null) {
      throw new NotFoundException("Team not found");
    }
    const isTeamOwner = await this.prisma.teamUsers.findFirst({where: {userId: userData.id, teamId: team.id, OR:[
      {role: "O"},
      {role: "A"}
    ]
    }}).catch(e=>{
      throw new DataBaseException("Internal Server Error");
      
    })

    if(!isTeamOwner){
      throw new NotAllowedException("Only administrators of this team can unsubscribe another member");
    }


    const userInscriptionByToken = await this.prisma.teamUsers.findFirst({
      where: {
        userId: parseInt(req.params.userId),
        teamId: parseInt(req.params.id)
      }
    }).catch(e=>{
      throw new DataBaseException("Internal Server Error");

    })

    if (userInscriptionByToken == null && userData.role != "A") {
      throw new NotFoundException("User not inscribed in this team");
    }
    if(userInscriptionByToken.role == "O"){
      throw new NotAllowedException("The Team Owner cannot be Unsubscribed");
    }
    if(userInscriptionByToken.role == "A" && isTeamOwner.role == "A" && userData.role != "A"){
        throw new NotAllowedException("Only a Owner can Unsubscribe an Admin");
    }
    return await this.prisma.teamUsers.delete({ where: { id: userInscriptionByToken.id } });
    
  }

  getAllInscriptions = async (req) => {

    const userData = req.user;

    return await this.prisma.teamUsers.findMany({
      where: { teamId: parseInt(req.params.id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
  };

  updateUserInscription = async(req)=> {
    const userData = req.user;
    const teamId = parseInt(req.params.id)
    const userId = parseInt(req.params.userId)
    
    if(! await this.isTeamOwner(userData, teamId)){
      throw new NotAllowedException("Only Team Owner can Update Inscriptions");
      
    }

    const tu = await this.prisma.teamUsers.findFirst({where: {teamId, userId}});
    if(!tu){
      throw new NotFoundException("Inscription not Found");
      
    }

    return await this.prisma.teamUsers.update({
      where: {id: tu.id},
      data:{
        status: req.body.status,
        role: req.body.role
      }
    }).catch(e=>{
      throw new DataBaseException("Internal Server Error");
      
    })


  }

  invitePlayer = async (req)=>{
    const userData = req.user
    const team = await this.prisma.team.findFirst({where:{id: parseInt( req.params.id)}}).catch(e=>{
      throw new DataBaseException("Internal Server Error");
    })
      
    const userTo = await this.prisma.user.findFirst({where: {id: parseInt(req.body.id)}}).catch(e=>{
      throw new DataBaseException("Internal Server Error");
    })

    if(!userTo){
      throw new NotFoundException("User not found");
      
    }
    if(!team){
      throw new NotFoundException("Team not found");
      
    }
    if(! await this.isTeamOwner(userData, team.id)){
      throw new NotAllowedException("You are not the owner of this team");
    }

    await inviteModel.inviteToTeam(userTo, userData, team, req).then(r=>{
      return {msg: "Invite Sent"}
    }).catch(e=>{
      DataBaseException("Internal Server Error")
    })
  } 

 updateInvite = async(req)=>{
    const userData = req.user;

    const accept = req.body.accept == 'true'? true : false


    const invite = await inviteModel.inviteValidation(req.query.token);
    if(invite ==false || !invite){
      throw new NotAllowedException("Invite Expired or already used");
      
    }

    const team = invite.team
    if(invite.toUser.id != userData.id){
      throw new NotAllowedException("Only the user invited can accept his invite");
    }

    if(req.body.accept == undefined || accept == true){
      await this.prisma.$transaction(async(tx)=>{
        
        await tx.invite.update({where: {id: invite.id}, data:{
          status: "A"
        }})

        await tx.teamUsers.create({
          data:{
            userId: userData.id,
            teamId: team.id,
            role: "P",
          }
        }).catch(e=>{
          if(e.code = "P2002"){
            throw new ConflictException("User already inscribed")
          }else{
            throw new DataBaseException("Internal server error");
            
          }
        })
      
        
      })
      return {msg: 'Invite Accepted'}
    }
    if(accept == false){
        await this.prisma.invite.update({where: {id: invite.id}, data:{
          status: "D"
        }})

      return {msg: 'Invite Denied'}
    }


  }

  approveTeam = async(req)=>{

    return await this.prisma.team.update({where: {id: parseInt(req.params.id)}, data:{
      status: "O"
    }}).catch(e=>{
       if (err.code === 'P2025') {
          throw new NotFoundException("Team not found");
        }
          else{
            throw new DataBaseException("Internal server error");
            
          }
    })
  }


  isTeamOwner = async (user, teamId)=>{
    const isTeamOwner = await this.prisma.teamUsers.findFirst({where: {userId: user.id, teamId, role: "O"}})
    return isTeamOwner != null || user.role== "A"
    
  }

  isTeamOwnerOrTeamAdmin = async (user, teamId)=>{
    const isTeamOwner = await this.prisma.teamUsers.findFirst({where: {userId: user.id, teamId, OR:[
      {role: "O"},
      {role: "A"}
    ]
    }})

    return isTeamOwner || user.role== "A"
    
  }

}

export default new TeamModel();
