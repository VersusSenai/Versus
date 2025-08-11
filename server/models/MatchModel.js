import { PrismaClient } from '@prisma/client';
import serviceUtils from '../services/util';
import eventModel from './EventModel.js';

class MatchModel {
  
  constructor() {
    this.prisma = new PrismaClient();
  }

  getAll = async (req) => {
    return await this.prisma.match.findMany({
      where: { eventId: parseInt(req.params.id) },
      include: {
        firstUser: {
          select: {
            username: true,
            id: true,
            email: true
          }
        },
        secondUser: {
          select: {
            username: true,
            id: true,
            email: true
          }
        },
      }
    });
  };

  getById = async (id) => {
    const match = await this.prisma.match.findUnique({
      where: { id: Number(id) },
      include: {
        firstUser: {
          select: {
            username: true,
            id: true,
            email: true
          }
        },
        secondUser: {
          select: {
            username: true,
            id: true,
            email: true
          }
        }
      }
    });

    if (!match) {
      throw new Error("Match not found");
    }

    return match;
  };

  create = async (matchData) => {
    const { eventId, firstTeamId, secondTeamId, time, winnerId, loserId, firstUserId, secondUserId } = matchData;

    const newMatch = await this.prisma.match.create({
      data: {
        eventId,
        firstTeamId,
        secondTeamId,
        time,
        winnerId,
        loserId,
        firstUserId,
        secondUserId
      },
    });

    return newMatch.id;
  };

  update = async (id, matchData) => {
    const { eventId, firstTeamId, secondTeamId, time, winnerId, loserId, firstUserId, secondUserId } = matchData;

    try {
      const updated = await this.prisma.match.update({
        where: { id: Number(id) },
        data: {
          eventId,
          firstTeamId,
          secondTeamId,
          time,
          winnerId,
          loserId,
          firstUserId,
          secondUserId
        },
      });
      return updated;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Match not found");
      }
      throw err;
    }
  };

  delete = async (id) => {
    try {
      const deleted = await this.prisma.match.delete({
        where: { id: Number(id) },
      });

      return deleted;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Match not found");
      }
      throw err;
    }
  };

  declareWinner = async (req) => {

    const userData = req.user;
    const match = await this.prisma.match.findFirst({where: {id: parseInt(req.params.id)}, include: {event: true}})
    const eventId = match.event.id;
    const isUserOwner = eventModel.isUserOwner(userData, match.event.id)

    if(!isUserOwner){
      throw new Error("User is not owner of this event");
    }
    if(!match.secondUserId){
      throw new Error("This Match have only 1 player")
    }
    
    const winnerId = parseInt(req.body.winnerId)
    let loserId;
    
    if(!match.event.multiplayer){
      if(winnerId == match.firstUserId){
        loserId = match.secondUserId;
      }else if(winnerId == match.secondUserId){
        loserId = match.firstUserId;
      }else{
        throw new Error("Wrong WinnerId");
      }
    }else{
      if(winnerId == match.firstTeamId){
        loserId = match.secondTeamId;
      }else if(winnerId == match.secondTeamId){
        loserId = match.firstTeamId;
      }else{
        throw new Error("Wrong WinnerId");
        
      }
    }
    
    if(match.winnerId){
      throw new Error("Match Already decided");
      
    }
      
    const inscriptions = await this.prisma.eventInscriptions.findMany({where:{eventId: match.event.id, role: "P"}});

    const total = inscriptions.length
    
    const maxKeys = Math.log2(total);

    if(match.keyNumber == maxKeys){
      if(!match.event.multiplayer){
        this.prisma.$transaction(async(tx)=>{
          
          await tx.match.update({where: {id: match.id}, data:{
            winnerId,loserId
          }})

          await tx.eventInscriptions.update({where: {userId_eventId: {userId: winnerId, eventId}}, data:{
            status: "W"
          }})
  
  
          await tx.eventInscriptions.update({where: {userId_eventId: {userId: loserId, eventId}}, data:{
            status: "L"
          }})
  
        })

      }else{
        
        this.prisma.$transaction(async(tx)=>{
          await tx.match.update({where: {id: match.id}, data:{
            winnerId,loserId
          }})
          await tx.eventInscriptions.update({where: {userId_eventId: {userId: winnerId, eventId}}, data:{
            status: "W"
          }})
          await tx.eventInscriptions.update({where: {userId_eventId: {userId: loserId, eventId}}, data:{
            status: "L"
          }})
          
        })    
      }
      
      return {msg: "event has ended"}

    }

    const pendingMatchInActualKey = await this.prisma.match.findFirst({where: {eventId: match.event.id, secondUserId: null, secondTeamId: null, keyNumber: match.keyNumber+1}})

    if(pendingMatchInActualKey ){
      if(!match.event.multiplayer){
        return this.prisma.$transaction(async (tx)=>{


          await tx.match.update({where: {id: match.id}, data:{
            winnerId, loserId
          }})

          await tx.eventInscriptions.update({where: {userId_eventId: {userId: loserId, eventId}}, data:{
            status: "L"
          }})

          return await tx.match.update({where:{ id: pendingMatchInActualKey.id}, data:{
            secondUserId: winnerId          
          }})
        })
     
      }else{

        return this.prisma.$transaction(async (tx)=>{
          await tx.match.update({where: {id: match.id}, data:{
            winnerId, loserId
          }})
          await tx.eventInscriptions.update({where: {userId_eventId: {userId: loserId, eventId}}, data:{
            status: "L"
          }})

          return await tx.match.update({where:{ id: pendingMatchInActualKey.id}, data:{
            secondTeamId: winnerId          
          }})
        })

      }
    }else{
      if(!match.event.multiplayer){
        return this.prisma.$transaction(async (tx)=>{

          await tx.match.update({where: {id: match.id}, data:{
            winnerId, loserId
          }})
          
          await tx.eventInscriptions.update({where: {userId_eventId: {userId: loserId, eventId}}, data:{
            status: "L"
          }})

          return tx.prisma.match.create({data:{
              eventId: match.event.id,
              keyNumber: (match.keyNumber+1),
              firstUserId: winnerId
          }})
        })
        
      }else{

        return this.prisma.$transaction(async (tx)=>{
          await tx.match.update({where: {id: match.id}, data:{
            winnerId, loserId
          }})

          await tx.eventInscriptions.update({where: {userId_eventId: {userId: loserId, eventId}}, data:{
            status: "L"
          }})

          
          return await tx.match.create({data:{
              eventId: match.event.id,
              keyNumber: (match.keyNumber+1),
              firstTeamId: winnerId
          }})
        })

      }
    }
  };


}

export default new MatchModel();
