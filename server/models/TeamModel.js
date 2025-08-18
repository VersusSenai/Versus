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
      data: { ...req.body, ownerId: userData.id },
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
      },
    }).catch(e=>{
      throw new DataBaseException("Failed to inscribe User");
      
    });
  };

  unsubscribe = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    const userInscriptionByToken = await this.prisma.teamUsers.findFirst({
      where: {
        userId: userData.id,
        teamId: parseInt(req.params.id)
      }
    });

    const team = await this.prisma.team.findFirst({ where: { id: parseInt(req.params.id) } });

    if (team == null) {
      throw new NotFoundException("Team not found");
    }

    if (userInscriptionByToken == null && userData.role != "A" && team.ownerId != userData.id) {
      throw new NotFoundException("You are not inscribed in this team");
    }

    if (userInscriptionByToken != null && userInscriptionByToken.userId == userData.id) {
      return await this.prisma.teamUsers.delete({ where: { id: userInscriptionByToken.id } });
    }

    if ((req.body.userId != null && req.body.userId != "") && (userData.role == "A" || team.ownerId == userData.id)) {
      const userInscriptionByReqId = await this.prisma.teamUsers.findFirst({
        where: {
          userId: parseInt(req.body.userId),
          teamId: parseInt(req.params.id)
        }
      });

      if (userInscriptionByReqId == null) {
        throw new NotFoundException("This user is not inscribed in this team");
      }

      if ((userData.role != "A" && team.ownerId != userData.id)) {
        throw new NotFoundException("This user is not owner of this team");
      }

      if ((userData.role == "A" || team.ownerId == userData.id)) {
        return await this.prisma.teamUsers.delete({ where: { id: userInscriptionByReqId.id } });
      }
    }
  };

  getAllInscriptions = async (req) => {
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

  isTeamOwner = async (user, teamId)=>{
    const isTeamOwner = await this.prisma.teamUsers.findFirst({where: {userId: user.id, teamId, role: "O"}})

    
  }
}

export default new TeamModel();
