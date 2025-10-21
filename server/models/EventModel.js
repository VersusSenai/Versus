import { PrismaClient, TeamInscription } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";
import serviceUtils from "../services/util.js";
import inviteModel from "./inviteModel.js";
import NotFoundException from "../exceptions/NotFoundException.js";
import BadRequestException from "../exceptions/BadRequestException.js";
import DataBaseException from "../exceptions/DataBaseException.js";
import NotAllowedException from "../exceptions/NotAllowedException.js";
import ConflictException from "../exceptions/ConflictException.js";
import notificationService from "../services/notificationService.js";
import ImageService from "../services/ImageService.js";
import prisma from "../ config/prismaClient.js";

class EventModel {
  getAll = async (req) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let status = req.query.status ? req.query.status : ["P", "O"];
    if (!Array.isArray(status)) {
      status = [status];
    }

    status.forEach((e) => {
      if (e != "P" && e != "O" && e != "E") {
        throw new BadRequestException("Status must be in ['P', 'O', 'E']");
      }
    });
    if (limit > 30) {
      limit = 30;
    }
    if (req.user.role == "A") {
      return await prisma.event
        .paginate({
          where: {
            status: { in: status },
            OR: [
              {
                eventInscriptions: { some: { team: { status: "O" } } },
              },
              {
                eventInscriptions: { some: { user: { status: "A" } } },
              },
            ],
          },
          include: {
            eventInscriptions: {
              where: {
                OR: [{ team: { status: "O" } }, { user: { status: "A" } }],
              },
            },
          },
        })
        .withPages({ page, limit });
    }

    return await prisma.event
      .paginate({
        where: {
          status: { in: status },
          AND: [
            {
              OR: [
                {
                  private: true,
                  eventInscriptions: {
                    some: { userId: req.user.id },
                  },
                },
                { private: false },
              ],
            },
            {
              OR: [
                {
                  eventInscriptions: {
                    some: { team: { status: "O" } },
                  },
                },
                {
                  eventInscriptions: {
                    some: { user: { status: "A" } },
                  },
                },
              ],
            },
          ],
        },
        include: {
          eventInscriptions: {
            where: {
              OR: [{ team: { status: "O" } }, { user: { status: "A" } }],
            },
          },
        },
      })
      .withPages({
        page,
        limit,
      });
  };

  getById = async (req) => {
    if (req.user.role == "A") {
      return await prisma.event
        .findUnique({
          where: { id: parseInt(req.params.id) },
        })
        .then((r) => {
          if (r == null) {
            throw new NotFoundException("Event not found");
          } else {
            return r;
          }
        });
    }

    return await prisma.event
      .findUnique({
        where: {
          id: parseInt(req.params.id),
          OR: [
            {
              private: true,
              eventInscriptions: {
                some: {
                  userId: req.user.id,
                },
              },
            },
            { private: false },
          ],
        },
      })
      .then((r) => {
        if (r == null) {
          throw new NotFoundException("Event not found");
        } else {
          return r;
        }
      });
  };

  create = async (req) => {
    const userData = req.user;
    const now = new Date();

    const { name, description, startDate, endDate, multiplayer, model } =
      req.body;
    const isPrivate = req.body.private;
    if (
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      multiplayer == null
    ) {
      throw new BadRequestException("Missing required fields");
    }

    const file = req.file;
    let image;
    if (file) {
      try {
        image = await ImageService.upload(file);
      } catch (error) {
        console.log(error);
        throw new DataBaseException("Intenal Server error");
      }
    }

    if (now > Date.parse(startDate)) {
      throw new BadRequestException("Event start date cannot be before today");
    }
    if (Date.parse(startDate) > Date.parse(endDate)) {
      throw new BadRequestException("Event start date cannot be after endDate");
    }
    if (parseInt(req.body.maxPlayers) % 2 != 0) {
      throw new BadRequestException("Player quantity must be even");
    }

    const newEvent = await prisma.event.create({
      data: {
        model,
        name,
        description,
        startDate,
        endDate,
        multiplayer:
          multiplayer == "true" || multiplayer == true ? true : false,
        private: isPrivate == "true" || isPrivate == true ? true : false,
        status: "P",
        maxPlayers: parseInt(req.body.maxPlayers),
        thumbnail: image ? image.url : undefined,
        eventInscriptions: {
          create: [
            { userId: userData.id, status: "C", role: "O", status: "O" },
          ],
        },
      },
    });

    return newEvent;
  };

  update = async (req) => {
    const isUserOwner = await this.isUserOwner(
      req.user,
      parseInt(req.params.id),
    );
    if (!isUserOwner) {
      throw new NotAllowedException(
        "Only the owner of this event can update it",
      );
    }
    const isPrivate = req.body.private;
    const event = await prisma.event.findFirst({
      where: { id: parseInt(req.params.id) },
    });
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    if (event.status != "P") {
      throw new ConflictException(
        "Only events with status 'Pending' can be updated",
      );
    }
    let image = {};
    if (typeof req.body.image == "string") {
      image["url"] = null;
    }
    const file = req.file;

    if (
      (event.thumbnail && file) ||
      (event.thumbnail && typeof req.body.image == "string")
    ) {
      let url = event.thumbnail.replace(/\/+$/, "");
      const partes = url.split("/");
      let toDelete = partes[partes.length - 1];
      await ImageService.delete(toDelete);
    }
    if (file) {
      try {
        image = await ImageService.upload(file);
      } catch (error) {
        throw new DataBaseException("Intenal Server error");
      }
    }

    let {
      name,
      description,
      startDate,
      endDate,
      multiplayer,
      maxPlayers,
      model,
    } = req.body;
    maxPlayers = maxPlayers === undefined ? undefined : parseInt(maxPlayers);

    return await prisma.event
      .update({
        where: { id: parseInt(req.params.id) },
        data: {
          name,
          description,
          startDate,
          endDate,
          multiplayer,
          private: isPrivate,
          model,
          maxPlayers,
          thumbnail: image ? image.url : undefined,
        },
      })
      .catch((e) => {
        if (e.code === "P2025") {
          throw new NotFoundException("Event not found");
        }
        throw new DataBaseException("Event cannot be Updated");
      });
  };

  inscribe = async (req) => {
    const userData = req.user;
    const eventId = parseInt(req.params.id);

    const event = await prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new BadRequestException("Event not found");
    if (event.keysQuantity != null) {
      throw new ConflictException("Event already started");
    }
    if (event.private) {
      throw new NotAllowedException(
        "You need to get invited to inscribe in a Private Tournment",
      );
    }

    if (event.multiplayer == true) {
      const teamId = req.body.id ? parseInt(req.body.id) : null;

      if (teamId != null && !isNaN(teamId)) {
        const team = await prisma.team.findFirst({
          where: { id: teamId },
        });

        if (!team) {
          throw new BadRequestException("Team does not exist");
        }

        const isTeamAlreadyInscribed = await prisma.eventInscriptions.findFirst(
          {
            where: {
              teamId: teamId,
              eventId: eventId,
            },
          },
        );

        if (isTeamAlreadyInscribed) {
          throw new ConflictException("Team already inscribed");
        }
        const userTeamInscription = await prisma.teamUsers.findFirst({
          where: {
            teamId: team.id,
            userId: userData.id,
          },
        });

        if (userTeamInscription.role == "O") {
          return prisma.eventInscriptions.create({
            data: {
              teamId: team.id,
              eventId: eventId,
              role: "P",
              status: "O",
            },
          });
        } else {
          throw new ConflictException("You are not the owner of this team");
        }
      }
    } else {
      const isUserAlreadyInscribed = await prisma.eventInscriptions.findFirst({
        where: {
          userId: userData.id,
          eventId: eventId,
        },
      });

      if (isUserAlreadyInscribed) {
        throw new ConflictException("User already inscribed");
      }

      // Caso seja inscrição individual
      return prisma.eventInscriptions.create({
        data: {
          userId: userData.id,
          eventId: eventId,
          role: "P",
          status: "O",
        },
      });
    }
  };

  delete = async (req) => {
    const isUserOwner = await this.isUserOwner(
      req.user,
      parseInt(req.params.id),
    );
    const event = await prisma.event.findFirst({
      where: { id: parseInt(req.params.id) },
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }
    if (event.status != "P") {
      throw new ConflictException(
        "Only events with status 'Pending' can be deleted",
      );
    }
    if (!isUserOwner) {
      throw new NotAllowedException("User is not owner of this event");
    }

    return await prisma.event
      .delete({ where: { id: parseInt(req.params.id) } })
      .catch((e) => {
        throw new DataBaseException("Error while trying to delete tournment");
      });
  };

  unsubscribe = async (req) => {
    const userData = req.user;
    const eventId = parseInt(req.params.id);

    const event = await prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new Error("Event not found");

    if (event.status != "P") {
      throw new ConflictException("Event already started");
    }

    const userInscription = await prisma.eventInscriptions.findFirst({
      where: { userId: userData.id, eventId },
    });
    if (!userInscription || userInscription.status == "R") {
      throw new ConflictException("User not inscribed");
    }

    if (userInscription != null && userInscription.role == "P") {
      await prisma.eventInscriptions.update({
        where: { id: userInscription.id },
        data: { status: "R" },
      });
    } else {
      throw new ConflictException("Owner cannot unsubscribe himself");
    }
  };

  unsubscribeByUserId = async (req) => {
    const eventId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    const teamId = parseInt(req.params.teamId);

    const event = await prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new Error("Event not found");
    if (event.status != "P") {
      throw new ConflictException("Event already started");
    }

    const isUserOwner = await this.isUserOwner(req.user, eventId);

    if (!isUserOwner) {
      throw new ConflictException("User is not Owner of this event");
    }

    if (!isNaN(teamId) && teamId != null) {
      const teamInscription = await prisma.eventInscriptions.findFirst({
        where: { userId: userId, eventId },
      });

      if (!teamInscription) {
        throw new ConflictException("Team not inscribed");
      }
      if (teamInscription != null && teamInscription.role == "P") {
        await prisma.eventInscriptions
          .delete({ where: { id: teamInscription.id }, data: { status: "R" } })
          .catch((e) => {
            throw new DataBaseException("Internal Server Error");
          });
      } else {
        throw new ConflictException("Owner cannot unsubscribe himself");
      }
    }
    const userInscription = await prisma.eventInscriptions.findFirst({
      where: { userId: userId, eventId },
    });

    if (!userInscription) {
      throw new ConflictException("User not inscribed");
    }
    if (userInscription != null && userInscription.role == "P") {
      await prisma.eventInscriptions.delete({
        where: { id: userInscription.id },
        data: { role: "R" },
      });
    } else {
      throw new ConflictException("Owner cannot unsubscribe himself");
    }
  };

  getAllInscriptions = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    const isOwner = await this.isUserOwner(req.user, parseInt(req.params.id));

    if (!isOwner) {
      throw new NotAllowedException(
        "Only the owner of this event can make this call",
      );
    }

    return await prisma.eventInscriptions
      .findMany({
        where: { eventId: parseInt(req.params.id), role: "P" },
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      })
      .catch((e) => {
        throw new DataBaseException("Internal Server Error");
      });
  };

  getMyInscriptions = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    let role = req.query.role;
    if (role === undefined || role.length === 0) {
      role = ["P", "O"];
    }

    if (!Array.isArray(role)) {
      role = [role];
    }
    return await prisma.event
      .findMany({
        where: {
          eventInscriptions: {
            some: {
              userId: userData.id,
              role: { in: role },
            },
          },
        },
        include: {
          eventInscriptions: {
            where: {
              userId: userData.id,
            },
          },
        },
      })
      .catch((e) => {
        console.log(e);
        throw new DataBaseException("Internal Server Error");
      });
  };

  startEvent = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    const event = await prisma.event.findFirst({
      where: { id: parseInt(req.params.id) },
    });

    if (!event) {
      throw new NotFoundException("Event not Found");
    }

    const inscriptions = await prisma.eventInscriptions.findMany({
      where: {
        eventId: event.id,
        role: "P",
        OR: [
          {
            team: { status: "O" },
          },
          {
            user: { status: "A" },
          },
        ],
      },
    });

    const matchesAlreadyExists = await prisma.match.findMany({
      where: { eventId: event.id },
    });

    if (matchesAlreadyExists[0] != null) {
      throw new ConflictException("Event Already started");
    }

    if (!(await this.isUserOwner(userData, event.id))) {
      throw new ConflictException("You do not own this tournment");
    }

    const now = new Date();
    const eventStartDate = event.startDate;
    const eventId = event.id;
    const total = inscriptions.length;

    const totalRounds = Math.log2(total);

    if (!Number.isInteger(totalRounds)) {
      throw new ConflictException(
        "The total numbers of players needs to be an perfect square root of 2",
      );
    }

    if (now < eventStartDate) {
      throw new ConflictException(
        `The event cannot start before its startDate: (${eventStartDate.toLocaleString()}).`,
      );
    }

    if (total < 2) {
      throw new ConflictException("Inscriptions not sufficient");
    }

    const matches = [];
    let currentTime = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.event.update({
      where: { id: eventId },
      data: {
        keysQuantity: totalRounds,
        matchsQuantity: total / 2,
        status: "O",
      },
    });
    let Matchs = [];
    if (event.multiplayer == false) {
      for (let i = 0; i < total; i += 2) {
        const firstUserId = inscriptions[i].userId;
        const secondUserId = inscriptions[i + 1].userId;

        const match = await prisma.match
          .create({
            data: {
              eventId,
              keyNumber: 1,
              firstUserId,
              secondUserId,
              time: new Date(currentTime),
            },
            select: {
              firstUser: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
              secondUser: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
              event: {
                select: {
                  name: true,
                  id: true,
                },
              },
              firstTeam: {
                select: {
                  id: true,
                  name: true,
                },
              },
              secondTeam: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })
          .catch((e) => {
            throw new DataBaseException(e);
          });
        matches.push(match);
        currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000);
      }
    } else {
      for (let i = 0; i < total; i += 2) {
        const firstTeamId = inscriptions[i].teamId;
        const secondTeamId = inscriptions[i + 1].teamId;
        const match = await prisma.match
          .create({
            data: {
              eventId,
              keyNumber: 1,
              firstTeamId,
              secondTeamId,
              time: new Date(currentTime),
            },
          })
          .catch((e) => {
            throw new DataBaseException("Error while creating match");
          });
        matches.push(match);
        currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000);
      }
    }
    this.notificateUsersOfEvent(
      event.id,
      "O Torneio " + event.name + " começou!. se prepare para jogar!",
    );
    return matches;
  };

  invitePlayer = async (req) => {
    const userData = req.user;
    const event = await prisma.event
      .findFirst({ where: { id: parseInt(req.params.id) } })
      .catch((e) => {
        throw new NotFoundException("Event not found");
      });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (!(await this.isUserOwner(userData, event.id))) {
      throw new NotAllowedException("You are not the owner of this tournment");
    }
    if (event.multiplayer) {
      const team = await prisma.team.findFirst({
        where: { id: parseInt(req.body.id) },
        include: {
          teamUsers: { where: { role: "O" }, include: { user: true } },
        },
      });
      if (!team) {
        throw new NotFoundException("Team not found");
      }
      const userTo = team.teamUsers[0].user;
      return await inviteModel
        .inviteToTournment(userTo, userData, team, event, req)
        .then((r) => {
          return { msg: "Invite Sent" };
        });
    }

    const userTo = await prisma.user
      .findFirst({ where: { id: parseInt(req.body.id) } })
      .catch((e) => {
        throw new NotFoundException("User not Found");
      });
    if (!userTo) {
      throw new NotFoundException("User not found");
    }

    return await inviteModel
      .inviteToTournment(userTo, userData, null, event, req)
      .then((r) => {
        return { msg: "Invite Sent" };
      });
  };

  updateInvite = async (req) => {
    const userData = req.user;

    const accept = req.body.accept == "true" ? true : false;

    const invite = await inviteModel.inviteValidation(req.query.token);
    if (invite == false || !invite) {
      throw new NotAllowedException("Invite Expired or already used");
    }

    const event = invite.event;
    if (invite.toUser.id != userData.id) {
      throw new NotAllowedException(
        "Only the user invited can accept his invite",
      );
    }

    if (req.body.accept == undefined || accept == true) {
      await prisma.$transaction(async (tx) => {
        await tx.invite.update({
          where: { id: invite.id },
          data: {
            status: "A",
          },
        });
        if (event.multiplayer) {
          await tx.eventInscriptions
            .create({
              data: {
                teamId: invite.teamId,
                eventId: event.id,
                role: "P",
                status: "O",
              },
            })
            .catch((e) => {
              if ((e.code = "P2002")) {
                throw new ConflictException("User already inscribed");
              } else {
                throw new DataBaseException("Internal server error");
              }
            });
        } else {
          await tx.eventInscriptions
            .create({
              data: {
                userId: userData.id,
                eventId: event.id,
                role: "P",
                status: "O",
              },
            })
            .catch((e) => {
              if ((e.code = "P2002")) {
                throw new ConflictException("User already inscribed");
              } else {
                throw new DataBaseException("Internal server error");
              }
            });
        }
      });
      return { msg: "Invite Accepted" };
    }
    if (accept == false) {
      await prisma.invite.update({
        where: { id: invite.id },
        data: {
          status: "D",
        },
      });

      return { msg: "Invite Denied" };
    }
  };

  // Funções de utiliddade do modelo

  //verifica se o user é dono do evento
  isUserOwner = async (user, eventId) => {
    const ownerInscrition = await prisma.eventInscriptions.findFirst({
      where: { userId: user.id, eventId: eventId, role: "O" },
    });

    if (ownerInscrition || user.role == "A") {
      return true;
    } else {
      return false;
    }
  };

  notificateUsersOfEvent = async (eventId, message) => {
    const event = await prisma.event.findFirst({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    if (event.multiplayer == true) {
      const teams = await prisma.eventInscriptions.findMany({
        where: { eventId, role: "P", teamId: { not: null } },
        include: { team: { include: { teamUsers: true } } },
      });

      for (const team of teams) {
        for (const user of team.team.teamUsers) {
          notificationService.sendNotification({
            userId: user.userId,
            title: "Notificação do Torneio: " + event.name,
            message: message,
            link: `/event/${event.id}`,
          });
        }
      }
    } else {
      const inscriptions = await prisma.eventInscriptions.findMany({
        where: { eventId, role: "P" },
        select: {
          userId: true,
        },
      });

      for (const inscription of inscriptions) {
        notificationService.sendNotification({
          userId: inscription.userId,
          title: "Torneio " + event.name + " foi iniciado!",
          message:
            "O Torneio " + event.name + " começou!. se prepare para jogar!",
          link: `/event/${event.id}`,
        });
      }
    }
  };
}

export default new EventModel();
