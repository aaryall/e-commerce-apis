import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description : String,
    Stock : Number , 
    reviews : [ //One to Many relationship of Product and Review
        {
            type :mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    categories : [ //One to Many relationship of Product and Review
        {
            type :mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    ]

})