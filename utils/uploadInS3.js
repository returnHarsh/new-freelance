import {S3Client , GetObjectCommand , PutObjectCommand} from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region : "ap-south-1",
  credentials : {
    accessKeyId : "AKIAY4Q7QYXTQURQKJNF",
    secretAccessKey : "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",
  }
})


export const getObjectUrl = async(key , bucketName)=>{
  try{
    const command = new GetObjectCommand({
      Bucket : bucketName,
      Key : key
    })

    const url = await getSignedUrl(s3Client , command);
    return url

  }catch(err){
    console.log("error in getting object url " , err.message)
  }
}

export const putObjectUrl = async(bucketName)=>{
  try{
    const fileName = uuidv4()
    const command = new PutObjectCommand({
      Bucket : bucketName,
      Key : fileName,
    })
    const url = await getSignedUrl(s3Client , command)
    return {fileName , url}
  }catch(err){
    console.log("error in putObjectUrl " , err.message)
  }
}
