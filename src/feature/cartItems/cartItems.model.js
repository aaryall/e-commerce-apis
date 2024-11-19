import { UserModel } from "../user/user.model.js";
import {ProductModel} from "../product/product.model.js";
export class CartItemsModel{
    constructor(userId, productId, quantity){
        this.id = cartItems.length + 1;
        this.userId = userId,
        this.productId = productId,
        this.quantity = quantity
    }

     static addItems(userId, productId, quantity){
        let results = []
        if(!quantity){
            results[0] = false;
            results[1] = 'Add some quantity'
            return results;
        }
        const userIdMatched = UserModel.getAllUsers().find(
            (u) => u.id == userId
        )
        if(!userIdMatched){
            results[0] = false;
            results[1] = 'User Not Found'
            return results;
        }

        const productFound = ProductModel.getSingleProduct(productId);
        if(!productFound){
            results[0] = false;
            results[1] = 'Product Not Found'
            return results;
        }
        const newCartItem = new CartItemsModel(userId, productId, quantity);
        results[0] = true;
        results[1] = newCartItem
        cartItems.push(newCartItem);
        return results;
    }


    static get(userId){
        return cartItems.filter(
            (i)=> i.userId == userId
        )
    }


    static delete(cartItemId, userId){
        
        const cartItemIndex = cartItems.findIndex(
            (i)=> i.id == cartItemId && i.userId == userId
        );
        if(cartItemIndex == -1){
            return 'Item not found';
        }
        else{
            cartItems.splice(cartItemIndex,1);
        }
    }
}

let cartItems =[
    {
        id : 1,
        userId : 1,
        productId : 2,
        quantity : 2
    },
    {
        id : 2,
        userId : 1,
        productId : 3,
        quantity : 1
    }

]