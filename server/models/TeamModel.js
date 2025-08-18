import { PrismaClient } from '@prisma/client';
import serviceUtils from '../services/util';
import NotFoundException from '../exceptions/NotFoundException';
import DataBaseException from '../exceptions/DataBaseException';
import NotAllowedException from '../exceptions/NotAllowedException';

class TeamModel {
  
  constructor() {
    this.prisma = new PrismaClient();
  }

  getAll = async () => {
    return await this.prisma.team.findMany();
  };

  getById = async (req) => {
    const team = await this.prisma.team.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!team) {
      throw new NotFoundException("Team not found");
    }

    return team;
  };

  create = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);

    return await this.prisma.team.create({
      data: { ...req.body, ownerId: userData.id , teamUsers: {
        create: [
          {userId: userData.id, role: "O"}
        ]
      }},
    }).catch(e=>{
      throw new DataBaseException("Team not created");
      
    });
  };

  update = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);

    const team = await this.prisma.team.findFirst({ where: { id: parseInt(req.params.id) } });

    if (team == null) {
      throw new NotFoundException("Team not found");
    }

    if (team.ownerId != userData.id && userData.role != "A") {
      throw new NotAllowedException("You do not own this team");
    }

    return await this.prisma.team.update({
      where: { id: team.id },
      data: {
        ...req.body
      }
    }).catch(e=>{
      throw new DataBaseException("Failed to Update Team");
      
    });
  };

  delete = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);

    const team = await this.prisma.team.findFirst({ where: { id: parseInt(req.params.id) } });

    if (team == null) {
      throw new NotFoundException("Team not found");
    }

    if (team.ownerId != userData.id && userData.role != "A") {
      throw new NotAllowedException("You do not own this team");
    }

    return await this.prisma.team.delete({ where: { id: team.id } });
  };

  inscribe = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    const team = await this.prisma.team.findFirst({ where: { id: parseInt(req.params.id) } });

    if (team == null) {
      throw new NotFoundException("Team not found");
    }

    return await this.prisma.teamUsers.create({
      data: {
        userId: userData.id,
        teamId: parseInt(req.params.id),
        role: "P"
      },
    }).catch(e=>{
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
        teamId: parseInt(req.params.id)
      }
    });

    if (userInscriptionByToken == null && userData.role != "A") {
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
      console.log(e)
    })
    console.log(isTeamOwner)
    if(!isTeamOwner){
      throw new NotAllowedException("Only administrators of this team can unsubscribe another member");
    }


    const userInscriptionByToken = await this.prisma.teamUsers.findFirst({
      where: {
        userId: parseInt(req.params.userId),
        teamId: parseInt(req.params.id)
      }
    }).catch(e=>{
      console.log(e)
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
    
    if(!this.isTeamOwner(userData, teamId)){
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

  isTeamOwnerOrTeamAdmin = async (user, teamId)=>{
    const isTeamOwner = await this.prisma.teamUsers.findFirst({where: {userId: user.id, teamId, OR:[
      {role: "O"},
      {role: "A"}
    ]
    }})

    return isTeamOwner || user.role== "A"
    
  }

  isTeamOwner = async (user, teamId)=>{
    const isTeamOwner = await this.prisma.teamUsers.findFirst({where: {userId: user.id, teamId, role: "O"
    }})

    return isTeamOwner || user.role== "A"
    
  }

}

export default new TeamModel();
