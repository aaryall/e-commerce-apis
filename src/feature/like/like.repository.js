

import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";


const likeModel = mongoose.model('like',likeSchema);
export class LikeRepository{
    async getLikes(type, id){
        return await likeModel.find({
            likeable : new ObjectId(id),
            types : type
        }).populate('user').populate({path:'likeable' , model : type})
    }
    async likeProduct (userId , productId){
        try{
            const newLike = new likeModel({
                user : new ObjectId(userId),
                likeable : new ObjectId(productId),
                types : 'Product'
            });
            await newLike.save();
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Product Add Failed",404);
    }
    }


    async likeCategory(userId , categoryId){
        try{
            const newLike = new likeModel({
                user : new ObjectId(userId),
                likeable : new ObjectId(categoryId),
                types : 'Category'
            });
            await newLike.save();
        }
        catch{
            console.log(err);
            throw new ApplicationError("Product Add Failed",404);
    }
    }
}