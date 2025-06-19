import { PrismaClient } from '@prisma/client';
import serviceUtils from './util.js';

const prisma = new PrismaClient();

const matchService = {

  getAll: async (req) => {
    return await prisma.match.findMany({where: {eventId: parseInt(req.params.id)}, include:{
      firstUser:{
        select:{
          username:true, id: true, email: true
        }
      },
      secondUser: {
        select:{
          username:true, id: true, email: true
        }}
    }}
  );
  },

  getById: async (id) => {
    const match = await prisma.match.findUnique({
      where: { id: Number(id) },
      include:{
      firstUser:{
        select:{
          username:true, id: true, email: true
        }
      },
      secondUser: {
        select:{
          username:true, id: true, email: true
        }}
  }});

    if (!match) {
      throw new Error("Match not found");
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
        throw new Error("Match not found");
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
        throw new Error("Match not found");
      }
      throw err;
    }
  },

  declareWinner: async( req)=>{

    const userData = await serviceUtils.getUserByToken(req);
    const matches =  await prisma.match.findMany({where: {eventId: parseInt(req.params.id)}});;
    const eventInscription = await prisma.eventInscriptions.findFirst({where: {eventId: parseInt(req.params.id), userId: userData.id}})
    



    const matchToUpdate = await prisma.match.findFirst({where: {id: parseInt(req.params.matchId)}})
    const greaterMatch = findCurrentMatch(matches);
    
    const event = await prisma.event.findFirst({where: { id: greaterMatch.eventId}})
    const totalPlayers = await prisma.eventInscriptions.count({where: {eventId: event.id, role: 'P' }})
  
    const isMultiplayer = event.multiplayer;
    const winner = await prisma[isMultiplayer ? "team" : "user"].findFirst({
      where: { id: parseInt(req.body.winnerId) },
    });
    const winnerId = winner.id;

    const totalRounds = Math.log2(totalPlayers);


    if(userData.role != "A" && userData.role != "O" && eventInscription.role != "O"){
      throw new Error("you do not have permission to this");
    }
    if(matchToUpdate.winnerId != null){
      throw new Error("Match Already Decided");
    }

    let loserId = 0;
    if (matchToUpdate.firstUserId === winnerId || matchToUpdate.firstTeamId === winnerId) {
      loserId = isMultiplayer ? matchToUpdate.secondTeamId : matchToUpdate.secondUserId;
    } else {
      loserId = isMultiplayer ? matchToUpdate.firstTeamId : matchToUpdate.firstUserId;
    }

    await prisma.match.update({where:{ id: matchToUpdate.id}, data:{
      winnerId: winnerId,
      loserId: loserId
    }})
    
    let actualKey = findActualKey(totalRounds, totalPlayers, greaterMatch.matchNumber);
    if(actualKey == -1 && (greaterMatch.secondUserId != null || greaterMatch.secondTeamId != null)){
      return {message: "Event has ended", winnerId}
      
    }



  if (
    (isMultiplayer && greaterMatch.secondTeamId != null) ||
    (!isMultiplayer && greaterMatch.secondUserId != null)) {
    const newMatchData = {
      matchNumber: greaterMatch.matchNumber + 1,
      keyNumber: actualKey,
      time: new Date(Date.now() + 10 * 60 * 1000),
      event: { connect: { id: event.id } },
    };

    if (isMultiplayer) {
      newMatchData.firstTeam = { connect: { id: parseInt(req.body.winnerId) } };
    } else {
      newMatchData.firstUser = { connect: { id: parseInt(req.body.winnerId) } };
    }
    return await prisma.match.create({
  data: newMatchData,
  select: {
    id: true,
    event: {
      select: {
        id: true,
        name: true
      }
    },
    firstUser: {
      select: {
        id: true,
        username: true,
        email: true
      }
    },
    secondUser: {
      select: {
        id: true,
        username: true,
        email: true
      }
    },
    firstTeam: {
      select: {
        id: true,
        name: true
      }
    },
    secondTeam: {
      select: {
        id: true,
        name: true
      }
    }
  }
});

  } else {
    const updateData = isMultiplayer
      ? { secondTeamId: parseInt(req.body.winnerId) }
      : { secondUserId: parseInt(req.body.winnerId) };

   return await prisma.match.update({
  where: { id: greaterMatch.id },
  data: updateData,
  select: {
    id: true,
    event: {
      select: {
        id: true,
        name: true
      }
    },
    firstUser: {
      select: {
        id: true,
        username: true,
        email: true
      }
    },
    secondUser: {
      select: {
        id: true,
        username: true,
        email: true
      }
    },
        firstTeam: {
      select: {
        id: true,
        name: true
      }
    },
    secondTeam: {
      select: {
        id: true,
        name: true
      }
    }
  }
});


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
