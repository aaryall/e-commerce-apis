import "./env.js";
import express from 'express';
import router from './src/feature/product/product.routes.js';
import bodyParser from 'body-parser';
import userRouter from './src/feature/user/user.routes.js'
import jwtAuth from './src/middlewares/jwt.middleware.js'
import cartItemRouter from './src/feature/cartItems/cartItems.routes.js';
import cors from 'cors';
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js'
import orderRouter from "./src/feature/order/order.routes.js";
import {connectUsingMongoose} from './src/config/mongooseConfig.js'
import mongoose from "mongoose";
import likeRouter from "./src/feature/like/like.routes.js";
const server = express();



server.use(bodyParser.json());

//CORS Policy configuration

//cors Using Library
var corsOptions = {
    origin : 'https://localhost:5500',
    allowHeaders:'*'
}
server.use(cors(corsOptions));

server.use(loggerMiddleware);
//Manual CORS
// server.use((req,res,next) =>{
//     res.header('Access-Control-Allow-Origin','http//localhost:5500')
//     res.headersSent('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Origin','*');
    
//     //return ok for preflight request.
//     if(req.method == "OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })



//for all req related to product , will go through product routes
server.use('/api/orders',jwtAuth , orderRouter)
server.use('/api/products',jwtAuth,router);
server.use('/api/users',userRouter);
server.use('/api/cartItems',jwtAuth,cartItemRouter)
server.use('/api/likes',jwtAuth ,likeRouter )

//Error handler middleware . It should always be last middleware
server.use((err, req,res,next)=>{
    console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
        console.log("inside err");
        return res.status(err.code).send(err.message);
    }

    //Server Error
    res.status(500).send(
        'Something went wrong, please try again later'
    );
});



server.listen(5000,()=>{
    console.log('Server is listening to 5000');
    //connectToMongoDB()
    connectUsingMongoose()
});

