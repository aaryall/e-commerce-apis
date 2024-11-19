import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository{
    constructor(){
        this.collection = "orders";
    }

    async placeOrderRep(userId){
        const client = getClient();
        const session = client.startSession();
        try {
            
            
            const db = getDB();
            session.startTransaction();
            // 1. Get cartItem and calculate total amount.
            const allItems = await this.getTotalAmount(userId , session);
            const finalTotalAmount =  allItems.reduce((acc,item)=>acc+item.totalAmount , 0);
            console.log('Order - ', finalTotalAmount);

            //2. Create an order record.
            const newOrder = new OrderModel(new ObjectId(userId),finalTotalAmount, new Date() )
            db.collection(this.collection).insertOne(newOrder,{session});

            //3. Reduce the stock.
            for(let item  of allItems){
                await db.collection("products").updateOne(
                    { _id : item.productId},
                    {$inc:{stock: -item.quantity}} , {session}
                )
            }
            //throw new Error("Somehting is wrong in placeholder");
            //4. Clear the cart Items.
            await db.collection("cartItems").deleteMany(
                {userId : new ObjectId(userId)} , {session}
            );
            await session.commitTransaction();
            session.endSession();
            return;
        } catch (error) {
            console.log('In Catch Just enter');
            await session.abortTransaction();
            console.log('In Catch 2');
            session.endSession();
            console.log('In catch 3');
            throw new ApplicationError("Something went wrong with database", 500);   
        }
        
    }

    async getTotalAmount(userId, session){
        const db = getDB();
        const items = await db.collection("cartItems").aggregate([
            {
                $match : {userId : new ObjectId(userId)}
            },
            //2. Get the products from products collection.
            {
                $lookup : {
                    from:"products",
                    localField : "productId",
                    foreignField :"_id",
                    as:"productInfo"
                }
            },
            {
                //3. Unwind the productInfo
                $unwind:"$productInfo"
            },
            //4. Cal totalAmount for each cartitem
            {
                $addFields:{
                    "totalAmount":{
                        $multiply:["$productInfo.price","$quantity"]
                    }
                }

            }
        ], {session}).toArray();
        console.log(items);
        return items;
        
       
    }
}