import { UserModel } from "../user/user.model.js";
import {ApplicationError} from '../../error-handler/applicationError.js'
export class ProductModel{
    constructor(name,description,categories,price,imageUrl){
       
        this.name = name
        this.description = description;
        this.categories = categories
        this.price = price
        //this.sizes= sizes
        this.imageUrl = imageUrl;
    }

}

var products =  [
    new ProductModel(1,'Product 1' , "Description for Product1", 25,"https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",'Category1'),
    new ProductModel(2,'Product 2' , 'Description for Product 2', 29.99,'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg','Category2',['M','XXL','S']),
    new ProductModel(3, 'Product 3', 'Description for product 3' ,15,'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg','Category1',['M','XL'])
];