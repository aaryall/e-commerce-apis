import { ApplicationError } from "../../error-handler/applicationError.js";
import { UserModel } from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';
export class UserController{

    constructor(){
        this.userRepository = new UserRepository
    }
    async signUp(req,res,next){
        const {
            name,
            email,
            password,
            type,
        } = req.body;
        const hashedPassword = await bcrypt.hash(password , 12);
        try {   
            let user  = new UserModel(name,email,hashedPassword,type);
            await this.userRepository.SignUp(user);
            res.status(201).send(user);
            
        } catch (err) {
            //Any Error from Database
            next(err); // it will be thrown by next middleware and it will get caught by Application level middleware in server.js
            
        }
        

         
      }
      async signIn(req,res , next){
        try{
            //1.Find user by Email
            const user = await this.userRepository.findByEmail(req.body.email);
            if(!user){
                //Email Doesn't match
                return res.status(400).send('Please Signup');
            }
            else{
                //2.Compare Password with hashed password
                const result = await bcrypt.compare(req.body.password , user.password); // Using bycrypt to hash our pasword so that in database paswords won't be exposed to developers 
                if(result){
                    //3. Create Token
                    const token =  jwt.sign({userID: user._id ,email : user.email },
                        process.env.JWT_SECRET,{
                            expiresIn : '1h',
                        }
                    )
                    //4. Send Token
                    return res.status(200).send(token);
                }
                else{
                    //Password doesnt match
                    return res.status(401).send('Incorrect credentials');
                }
            }
        }
        catch(err){
            //Any Error from Database
            next(err);
            console.log(err);
            return res.status(400).send("Something went wrong");
        }
    
    }

    async resetPassword(req,res,next){
        const {newPassword} = req.body;
        const userId = req.userId;
        const hashedPassword = await bcrypt.hash(newPassword , 12);
        try {
            await this.userRepository.resetPassword(userId , hashedPassword);
            res.status(200).send("Password is reset");

        } catch (error) {
            console.log(err);
            return res.status(400).send("Something went wrong");
        }

    }
}