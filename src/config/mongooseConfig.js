import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../feature/product/category.schema.js";

dotenv.config();
const url = process.env.DB_URL;

export const connectUsingMongoose = async() =>{
    try {
        await mongoose.connect(url , {useNewUrlParser : true , useUnifiedTopology: true});
        console.log("Mongodb using Mongoose is connected");
        await addCategories();
        
    } catch (error) {

        console.log(error);
        
    }
}

async function addCategories(){
    const categoryModel = mongoose.model('Category', categorySchema);
    const categories  = await categoryModel.find();
    if(!categories || categories.length == 0){
        await categoryModel.insertMany([{name : 'Books'},
            {name : 'Clothing'},
            {name : 'Electronics'}
        ]);
    }
    console.log('Categories are added');
}