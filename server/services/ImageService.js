import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs"
import path from 'path';
import 'dotenv/config';


class ImageService{
    constructor(){
        this.client = new S3Client({
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
        console.log(process.env.AWS_S3_ENDPOINT)
        try {
            const fileContent = fs.readFileSync(file.path);
            const key = file.filename + new Date().getTime();
            
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                Body: fileContent,
                ContentType: "image/jpeg"
            }

            const command = new PutObjectCommand(params)
            const response = await this.client.send(command);
            clearTempFiles()
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


const uploadsPath = path.join(path.resolve(), 'uploads');

async function clearTempFiles() {
   try {
     // 💡 fs.promises.readdir retorna uma Promise que pode ser usada com await
     const files = await fs.readdir(uploadsPath);
     
     // Continue com a lógica de exclusão
     for (const file of files) {
       const filePath = path.join(uploadsPath, file);
       await fs.unlink(filePath); // Exclui o arquivo
       console.log(`Arquivo temporário deletado: ${filePath}`);
     }

   } catch (error) {
     console.error("Erro ao limpar arquivos temporários:", error);
   }
}


export default new ImageService();