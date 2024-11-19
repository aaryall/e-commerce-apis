import { ApplicationError } from "../../error-handler/applicationError.js";
import { CartItemsModel } from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";


export class CartItemController{
    constructor(){
        this.cartItemRepository = new CartItemsRepository();
    }
     async add(req,res){
        // const {productId, quantity} = req.query;
        // const userId = req.userId;
        
        // const newItem = CartItemsModel.addItems(userId,productId,quantity);
        // if(!newItem[0]){
        //     res.status(400).json({success : false , msg : newItem[1]});
        // }
        // else{
        //     res.status(201).json({success : true , msg : newItem[1]});
        // }  
        try{
            const {productId, quantity} = req.query;
            const userId = req.userId;
            
            const cartItemAdded= await this.cartItemRepository.addItems(userId,productId,Number(quantity));
            if(cartItemAdded){
                res.status(201).send("Cart is Updated");
            }
            else{
                res.status(400).send('Failed to add Cart Item');
            }
        } 
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);

        }

    }

        async get(req,res){
            // const userId = req.userId;
            // const items = CartItemsModel.get(userId);
            // return res.status(200).send(items);
            try{
                const userId = req.userId;
            const allItems = await this.cartItemRepository.get(userId);
            if(allItems){
                res.status(200).send(allItems);
            }
            else{
                res.status(40).send('Failed to get all Cart Items');
            }
            }
            catch(err){
                console.log(err);
                throw new ApplicationError("Something went wrong",500);
    
            }
        }

        async delete(req,res){
            const userId = req.userId;
            const cartItemId = req.params.id;
            const isDeleted = await this.cartItemRepository.delete(cartItemId,userId);
            if(!isDeleted){
                res.status(404).send("Item not found");
            }
            else{
                res.status(200).send('Cart Item removed successfully');
            }

        }


            
        
        
    }
