import { PrismaClient } from '@prisma/client';
import BadRequestException from "../exceptions/BadRequestException";
import DataBaseException from "../exceptions/DataBaseException";
import { pagination } from "prisma-extension-pagination";


class NotificationModel {

    constructor() {
        this.prisma = new PrismaClient().$extends(pagination());
    }

    markAsRead = async (req) => {
        const { id } = req.params;
        const user = req.user;

        if (!id) {
            throw new BadRequestException("Notification ID is required");
        }
        await this.prisma.notification.update({
            where: {
                id: parseInt(id),
                userId: user.id,
                read: false
            },
            data: {
                read: true
            }
        }).catch(err => {
            if(err.code === 'P2025'){
                throw new BadRequestException("Notification not found or already read");
            }
            throw new DataBaseException("Internal Server Error");
        })
        return { msg: "Notification marked as read" };
    }

    create= async (notification) => {
        
        return await this.prisma.notification.create({
            data: {
                userId: notification.userId,
                title: notification.title,
                message: notification.message,
                link: notification.link,
                read: false
            }
        })
    }
    getAllFromUser = async (req) => {
        const userId = req.user.id;
        let { page, limit, read } = req.query;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 10;
        read = read === 'true' ? true : read === 'false' ? false : undefined;
        if(limit > 50){
            limit = 50;
        }

        return await this.prisma.notification.paginate({
            where: {
                userId: userId,
                read
            },
            orderBy: {
                read: 'asc',
                createdAt: 'desc'
            }
        }).withPages({page, limit});
    }

     

}

export default new NotificationModel();