import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import {productSchema} from './product.schema.js'
import {reviewSchema} from './review.Schema.js'
import {categorySchema} from './category.schema.js'


const ProductModel = mongoose.model('product' , productSchema);
const ReviewModel = mongoose.model('Review' , reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);
class ProductRepository{
    constructor(){
        this.collection = "products";
    }


    async add(productData){
        try{
            // const db = getDB();
            // const collection  = db.collection(this.collection);
            // await collection.insertOne(newProduct);
            // return newProduct;

            console.log(productData);
            productData.categories = productData?.categories?.split(',').map(e => e.trim());
            console.log(productData);
            const newProduct = ProductModel(productData);
            const savedProduct = await newProduct.save();
            //2.Update Category
            await CategoryModel.updateMany(
                {_id : {$in : productData.categories}},
                {
                    $push : { products : new ObjectId(savedProduct._id) }
                }
            )

        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Product Add Failed",404);
        }
        

    }

    async getAll(){
        try{
            const db = getDB();
            const collection  = db.collection(this.collection);
         
            const allProducts = await collection.find().toArray();
            return allProducts;
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }

    }

    async get(id){
        try{
            const db = getDB();
            const collection  = db.collection(this.collection);
         
            const singleProduct = await collection.findOne({_id:new ObjectId(id)});
            return singleProduct;
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }
    }

    async filter(minPrice , category){
        try{
            const db = getDB();
            const collection  = db.collection(this.collection);
            let filterExpression = {};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            // if(maxPrice){
            //     filterExpression.price = {...filterExpression.price , $lte: parseFloat(maxPrice)}
            // }
            if(category){
                filterExpression = {$or : [{category:category} , filterExpression]}
                //filterExpression.category = category;
            }
            return await collection.find(filterExpression).toArray();
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }
    }


    // async rateProduct(userId, productId, rating){
    //     try{
    //         const db = getDB();
    //         const collection  = db.collection(this.collection);
    //         //Find the product
    //         const productFound = await collection.findOne({_id:new ObjectId(productId)});
    //         const userRating = productFound?.ratings?.find(r=> r.userId == userId);
    //         if(userRating){
    //             await collection.updateOne({
    //                 _id : new ObjectId(productId) , "ratings.userId": new ObjectId(userId)
    //             } , {
    //                 $set : {
    //                     "ratings.$.rating":rating
    //                 }
    //             })
    //         }else{
    //             await collection.updateOne({
    //                 _id:new ObjectId(productId)
    //             },{   $push:{ratings:{userId:new ObjectId(userId),rating}}  })
    //         }
            
    //     }
    //     catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong",500);
    //     }
    // }

    // async rateProduct(userId, productId, rating){
    //     try{
    //         const db = getDB();
    //         const collection  = db.collection(this.collection);
    //         //Using below approach for Scenario : Same User trying to rate a product probably with two different device this is known as Race condition
    //         // Above Solution will not work when for this scenario
    //         //Solution : Using pull operator it will pull if any exisiting rating already present 
    //         // next updateOne will push the new rating , if already not rating is not present then next updateOne will push the new rating only
    //         await collection.updateOne({
    //             _id: new ObjectId(productId)
    //         },
    //         {
    //             $pull: {ratings:{userId: new ObjectId(userId)}}
    //         })

    //         await collection.updateOne({
    //             _id:new ObjectId(productId)
    //         },
    //         {   
    //             $push:{ratings:{userId:new ObjectId(userId),rating}}  
    //         })
            
            
    //     }
    //     catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong",500);
    //     }
    // }

    async rateProduct(userId, productId, rating){
        try {
            //1.Check if product exist
            const productToUpdate = await ProductModel.findById(productId);
            if(!productToUpdate){
                throw new Error('Product not found')
            }
            //2. Get the exisiting review
            const userReview = await ReviewModel.findOne({product : ObjectId.createFromHexString(productId) , user : ObjectId.createFromHexString(userId)})
            console.log('userReview : ',userReview)
            if(userReview){
                userReview.rating = rating;
                await userReview.save();
            }
            else{
            //3. Rating don't exist so create new rating associate with that user and product
                const newReview = new ReviewModel({
                    product : ObjectId.createFromHexString(productId),
                    user : ObjectId.createFromHexString(userId),
                    rating : rating
                });
                newReview.save();
            }
            

        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong",500);
        }
    }
    async averageProductPricePerCategroy(){
        try{
            const db = getDB();
            return await db.collection(this.collection).aggregate(
                [
                    {
                        //Stage 1: Get Average Price per category
                        $group:{
                            _id:"$category",
                            averagePrice:{$avg:"$price"}
                        }
                    }
                ]).toArray();
        }
        catch(error){
            console.log(err);
            throw new ApplicationError("Something went wrong",500);
        }
    }
}

export default ProductRepository;