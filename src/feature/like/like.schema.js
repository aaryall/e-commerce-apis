import mongoose from "mongoose";


export const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likeable:{
        type : mongoose.Schema.Types.ObjectId,
        ref_Path:'types'
    },
    types:{
        type: String,
        enum:['Product' , 'Category']
    }
}).pre('save' , (next)=>{ //Using Mongoose Middleware to perform any pre or post operation 
    console.log('Someone has liked the product...');
    next();
}).post('save',(doc)=>{
    console.log('Like is saved');
    console.log(doc);
}).pre('find',(next)=>{
    console.log('Retreieving likes');
    next();
}).post('find' , (docs)=>{
    console.log("Find is completed");
    console.log(docs);
})