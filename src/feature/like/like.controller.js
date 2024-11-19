import { LikeRepository } from "./like.repository.js";


export class likeController{
    constructor(){
        this.likeRepository = new LikeRepository();
    }

    async likeItem(req,res,next){
        try {
            const {id, type} = req.body;
            const userId = req.userId;
            if(type != 'Product' && type !='Category'){
                return res.status(400).send('Invalid Types');
            }
            if(type =='Product'){
                this.likeRepository.likeProduct(userId,id);
            }
            else{
                this.likeRepository.likeCategory(userId,id);
            }
            res.status(200).send('Liked Successfully !! ');
        } catch (error) {
            console.log(error);
        }
    }

    async getLikes(req,res,next){
        try {
            const { id , type} = req.query;
            const likes = await this.likeRepository.getLikes(type, id);
            return res.status(200).send(likes);
            
        } catch (error) {
            console.log(error);
            return res.status(404).send("Smething went wrong");
        }
    }

}