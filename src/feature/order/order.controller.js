import OrderRepository from "./order.repository.js";


export default class OrderController{
    constructor(){
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req,res,next){
        try {
            const userId = req.userId;
            await this.orderRepository.placeOrderRep(userId);
            res.status(201).send('Order is placed');
        } catch (error) {
           
            console.log(error);
            return res.status(500).send("Something went wrong");

        }
    }
}