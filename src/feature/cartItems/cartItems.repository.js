import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";


export default class CartItemsRepository{

    constructor(){
        this.collection = "cartItems";
    }


    async addItems(userId, productId, quantity){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const id = await this.getNextCounter(db);
            //Find the document
            //either insert or update
            console.log(id);
            return await collection.updateOne({
                userId: new ObjectId(userId), 
                productId: new ObjectId(productId)
            },{
                $setOnInsert: {_id:id}, 
               $inc :{quantity : quantity} 
            },{ upsert: true });
        }
        catch(err){
            console.log('Error in inserting cart Items : ',err);
        }
    }
    async get(userId){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find({
                userId: new ObjectId(userId)
            }).toArray();
        } catch (error) {
            console.log('Error in getting cart Items : ',err);

        }
    }

    async delete(cartItemId,userId){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const result = await collection.deleteOne({userId: new ObjectId(userId) , 
                _id : new ObjectId(cartItemId)
            });
            return result.deletedCount > 0;
        } catch (err) {
            console.log('Error in getting cart Items : ',err);

        }
    }

    async getNextCounter(db){
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            { $inc : {value:1}},
            {returnDocument: 'after'}
        )
        console.log(resultDocument);
        return resultDocument.value;

    }
}