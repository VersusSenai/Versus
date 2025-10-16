import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import 'dotenv/config';
import InternalServerError from "../exceptions/InternalServerError.js";


class ImageService{
    constructor(){
        this.client = new S3Client( {
            region: 'us-east-1',
            endpoint: process.env.AWS_S3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_ID,
                secretAccessKey: process.env.AWS_S3_ACCESS_KEY
            },
            forcePathStyle: true,

        })

    }

    
    upload = async(file)=>{ 
        
        try {
            const fileContent = file.buffer;

            const key = file.originalname + new Date().getTime().toString();
            
            const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype, 
            Metadata: {
                originalName: file.originalname,
                uploadedAt: new Date().getTime().toString()
            }
            }

            const url = process.env.BACKEND_URL +`/image/${key}`  || 'http://localhost:8080' +`/image/${key}`
            const command = new PutObjectCommand(params)
            const response = await this.client.send(command);
            return {name: key, url: url, response}
        } catch (error) {
            throw new InternalServerError();
        }

    }

    get = async(fileKey)=>{
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: fileKey
            }

            const command = new GetObjectCommand(params)

            const response = await this.client.send(command);
            const stream = response.Body;
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            return buffer
        }catch(e){
            throw new InternalServerError();
        }
    }

    delete = async(fileKey)=>{
        try {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: fileKey
            }

            const command = new DeleteObjectCommand(params)

            const response = await this.client.send(command);
            return response;
        } catch (error) {
            throw new InternalServerError();

        }
    }


}



export default new ImageService();