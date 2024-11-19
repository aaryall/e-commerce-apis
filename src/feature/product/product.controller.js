
import { ApplicationError } from "../../error-handler/applicationError.js";
import {ProductModel} from "./product.model.js";
import ProductRepository from './product.repository.js'



export class ProductController{
    constructor(){
        this.productRepository = new ProductRepository();
    }
    async getAllProduct(req,res){
        try{
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        }
        catch(err){
            console.log(err)
            throw new ApplicationError("Something went Wrong",500);
        }
        
    }

    async addProduct(req,res){
        try{
            const {name,description,categories,price} = req.body
            const addedProduct = new ProductModel(name,description,categories,parseFloat(price),req?.file?.filename);
            await this.productRepository.add(addedProduct);
            console.log(addedProduct);
            res.status(201).send('Post request send');
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went Wrong in database",500);
        }
    }
    async rateProduct(req,res){
        try{
            const userID = req.userId;
            const productId = req.body.productID;
            const rating = req.body.rating;
            await this.productRepository.rateProduct(userID,productId,rating);
            return res.status(200).send("Rating added successfully !");
        }
        catch(err){
            console.log(err)
            throw new ApplicationError("Something went wrong",500);
        
        }
        
    }
    async getOneProduct(req,res){
        try{
            const id = req.params.id;
            console.log(id);
            const product = await this.productRepository.get(id);
            //const product = ProductModel.getSingleProduct(id);
            if(!product){
                res.status(404).send('Product not found');
            }
            else{
                res.status(200).send(product);
            }
        }
        catch(err){
            console.log(err)
            throw new ApplicationError("Something went wrong",500);
        }
        
    }
    async getFilterItem(req,res){
        //localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1
        try{
            const minP = req.query.minPrice;
            const maxP = req.query.maxPrice;
            const categrory = req.query.category; 
            console.log('maxP ',maxP);
            const item = await this.productRepository.filter(minP,categrory);
            if(!item){
                res.status(404).send('No Item found with this filter criteria');
            }
            else{ 
                res.status(200).send(item);
            }
        }
        catch(err){
            throw new ApplicationError("Something went wrong",500);
        }
        
    }

    async averagePrice(req,res,next){
        try{
            const  result = await this.productRepository.averageProductPricePerCategroy();
            console.log("averagePrice ",result);
            res.status(200).send(result);

        }
        catch(error){

        }
    }

}