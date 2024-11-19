import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


// creating model from schema = collection
const UserModel = mongoose.model('users', userSchema)


export default class UserRepository{
    async SignUp(user){
        try {
            //Instance of a model = document
            const newuser = new UserModel(user);
            await newuser.save();
        } catch (err) {
            console.log(err);
            //If validation didn't match it will throw error of ValidationError which is present in mongoose
            // We need to handle ValidationError error seperately becuz client need to see this error and correct the format.
            if(err instanceof mongoose.Error.ValidationError){ 
                throw err;
            }
            else{
                console.log(err);
                throw new ApplicationError("Something went wrong with Database",500);
            }
        }
        
    }


    async signIn(email, password){
        try {
            //Checking in document
            return await UserModel.findOne({email , password});
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with Database",500);
        }
    }


    async findByEmail(email){
        try{
            //Checking if user email matches with any email present in database or not
        return await UserModel.findOne({email});
   
        }
        catch(err){
            console.log(error);
            throw new ApplicationError("Something went wrong with Database",500);
           
        }   
    }

    async resetPassword(userId , newPassword){
        try {
            let user = await UserModel.findById(userId);
            if(user){
                user.password = newPassword;
                user.save(); //save() can be used with create / update both depend if id already present it will update if not it will create
            }
            else{
                throw new Error("User not found");
            }

        } catch (error) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database",500);
        }   
    }
    
}