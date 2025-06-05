import { PrismaClient } from '@prisma/client';
import serviceUtils from './util.js';

const prisma = new PrismaClient();

const matchService = {

  getAll: async (req) => {
    return await prisma.match.findMany({where: {eventId: parseInt(req.params.id)}});
  },

  getById: async (id) => {
    const match = await prisma.match.findUnique({
      where: { id: Number(id) },
    });

    if (!match) {
      throw new Error("Partida não encontrada");
    }

    return match;
  },

  create: async (matchData) => {
    const { eventId, firstTeamId, secondTeamId, time, winnerId, loserId, firstUserId, secondUserId } = matchData;

    const newMatch = await prisma.match.create({
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
  },

  update: async (id, matchData) => {
    const { eventId, firstTeamId, secondTeamId, time, winnerId, loserId, firstUserId, secondUserId } = matchData;

    try {
      const updated = await prisma.match.update({
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
        throw new Error("Partida não encontrada");
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const deleted = await prisma.match.delete({
        where: { id: Number(id) },
      });

      return deleted;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Partida não encontrada");
      }
      throw err;
    }
  },

  declareWinner: async( req)=>{

    const userData = await serviceUtils.getUserByToken(req);
    const matches =  await prisma.match.findMany({where: {eventId: parseInt(req.params.id)}});;
    const eventInscription = await prisma.eventInscriptions.findFirst({where: {eventId: parseInt(req.params.id), userId: userData.id}})
    
    const winner = await prisma.user.findFirst({where: {id: parseInt(req.body.winnerId)}})

    const matchToUpdate = await prisma.match.findFirst({where: {id: parseInt(req.params.matchId)}})
    const greaterMatch = findCurrentMatch(matches);
    
    const event = await prisma.event.findFirst({where: { id: greaterMatch.eventId}})
    const totalPlayers = await prisma.eventInscriptions.count({where: {eventId: event.id, role: 'P' }})
    
    const totalRounds = Math.log2(totalPlayers);


    if(userData.role != "A" && userData.role != "O" && eventInscription.role != "O"){
      throw new Error("you do not have permission to this");
    }
    if(matchToUpdate.winnerId != null){
      throw new Error("Match Already Decided");
    }

    let loserId = 0;
    if(matchToUpdate.firstUserId == parseInt(req.body.winnerId)){
      loserId = matchToUpdate.secondUserId
    }else{
      loserId = matchToUpdate.firstUserId
    }
    await prisma.match.update({where: {id: parseInt(req.params.matchId)},data:{
      winnerId: parseInt(req.body.winnerId),
      loserId: loserId
    }})
    
    
    let actualKey = findActualKey(totalRounds, totalPlayers, greaterMatch.matchNumber);
    if(actualKey == -1){
      throw new Error("Event has ended");
      
    }

    if(greaterMatch.secondUserId != null){
      return await prisma.match.create({data:{
        eventId: event.eventId,
        matchNumber: greaterMatch.matchNumber +1 ,
        keyNumber: actualKey,
        time: new Date(Date.now() + 10 * 60 * 1000),
        firstUser: {
          connect: winner
        },
        event:{
          connect: event
        }
      }})
    }else{
      return await prisma.match.update({where:{
        id: greaterMatch.id
      }, data:{
        secondUserId: parseInt(req.body.winnerId)  
      }})
    }


  }

};

function findCurrentMatch(matches){


  let matchNumber = 0;
  let maior;
  let i = 0
  for (i; i < matches.length; i++) {
    
    if(matches[i].matchNumber > matchNumber){
      matchNumber = matches[i].matchNumber
      maior = matches[i];
    }


  } 
  return maior
}

function findActualKey(totalRounds, totalPlayers, matchNumber) {
  const matchIndex = matchNumber
  let matchesSoFar = 0;

  for (let round = 1; round <= totalRounds; round++) {
    const matchesThisRound = totalPlayers / Math.pow(2, round);

    if (matchIndex < matchesSoFar + matchesThisRound) {
      return round;
    }

    matchesSoFar += matchesThisRound;
  }

  return -1;
}


export default matchService;
