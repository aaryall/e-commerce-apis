//1. Import express
import express from 'express';
import { likeController } from './like.controller.js';
const likeRouter = express.Router();




const likecontroller =  new likeController()

likeRouter.post('/',(req,res,next)=>{
    likecontroller.likeItem(req,res,next);
});

likeRouter.get('/',(req,res,next)=>{
    likecontroller.getLikes(req,res,next);
});

export default likeRouter;
