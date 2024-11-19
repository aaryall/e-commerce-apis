import express from 'express';
import { CartItemController } from './cartItems.controller.js';


const cartItemRouter = express.Router();


const cartItemController = new CartItemController();

cartItemRouter.delete('/:id',(req,res)=>{
    cartItemController.delete(req,res);
});
cartItemRouter.get('/',(req,res)=>{
    cartItemController.get(req,res);
});
cartItemRouter.post('/',(req,res)=>{
    cartItemController.add(req,res);
});




export default cartItemRouter;