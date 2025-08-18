import 'dotenv/config';
import nodemailer from "nodemailer";
import MailError from '../exceptions/MailError';

class MailSender{

    mailSender;

    constructor(){
        let host = process.env.SMTP_HOST;
        let port = process.env.SMTP_PORT;
        let username = process.env.SMTP_USERNAME;
        let password = process.env.SMTP_PASSWORD;

        this.mailSender = nodemailer.createTransport({
            host, port, auth:{
                user: username, pass: password
            }
        })
    }

    sendMail = async({to, subject, text, html})=>{
        await this.mailSender.sendMail({
            to, subject, text, html
        }).then(r=>{
            return {msg: "Message Sent"}
        }).catch(e=>{
            throw new MailError("Failed to sendo email");
            
        })


    }
}

export default new MailSender()