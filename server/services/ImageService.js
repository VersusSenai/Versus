import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs"
import 'dotenv/config';


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
            const fileExtension = file.originalname.split('.').pop();
               const fileNameWithoutExt = file.originalname
                .replace(`.${fileExtension}`, '')
                .replace(/[^a-zA-Z0-9]/g, '_') // Remove caracteres especiais
                .substring(0, 50); // Limita o tamanho

            console.log(file)
            const key = file.originalname + new Date().getTime().toString();
            
            const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype, // Usar o mimetype real do arquivo
            Metadata: {
                originalName: file.originalname,
                uploadedAt: new Date().getTime().toString()
            }
            }

            const command = new PutObjectCommand(params)
            const response = await this.client.send(command);
            return {name: key, url:`http://localhost:8080/image/${key}`, response}
        } catch (error) {
            throw error;
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
            console.log(e)
        }
    }

    


}



export default new ImageService();