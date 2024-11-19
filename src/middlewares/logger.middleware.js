import fs from 'fs';
import winston  from 'winston';

const fsPromise = fs.promises;

//Manual Creation of Log
// async function log(logData){
//     try{
//         logData = `\n ${new Date().toString()} - Log Data : ${logData}`
//         await fsPromise.appendFile("log.txt",logData);
//     }
//     catch(err){
//         console.log(err);

//     }
// }


const logger = winston.createLogger({
    level : 'info',
    format : winston.format.json(),
    defaultMeta : { service : 'request-logging'},
    transports : [
        new winston.transports.File({
            filename : 'log.txt'
        })
    ]
})

const loggerMiddleware = async (req, res , next) =>{
    //1. Log request body.
    const logData = `${req.url} - ${JSON.stringify(
        req.body
    )}`;
    logger.info(logData)
    next();
}
    export default loggerMiddleware;