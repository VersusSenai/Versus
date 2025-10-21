import DataBaseException from "../exceptions/DataBaseException.js";
import NotAllowedException from "../exceptions/NotAllowedException.js";
import prisma from "../ config/prismaClient.js";

class ApplicationModel {
  getAll = async (req) => {
    let page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

    let status = req.query.status == null ? ["O"] : [...req.query.status];

    return await prisma.application
      .paginate({ where: { status: { in: status } } })
      .withPages({
        page,
        limit,
      })
      .catch((e) => {
        throw new DataBaseException("Internal Server Error");
      });
  };

  create = async (req) => {
    const user = req.user;

    return await prisma.application
      .create({
        data: {
          fromUserId: user.id,
          applicationType: "O",
          Description: req.body.description,
        },
      })
      .catch((e) => {
        throw new DataBaseException("Internal Server Error");
      });
  };

  acceptApplication = async (req) => {
    const application = await prisma.application.findFirst({
      where: { id: parseInt(req.params.id), applicationType: "O" },
    });

    if (application.fromUserId == req.user.id) {
      throw new NotAllowedException(
        "An user cannot accept his own application",
      );
    }

    return await prisma.user.update({
      where: { id: application.fromUserId },
      data: {
        role: "O",
      },
    });
  };
}

export default new ApplicationModel();
