import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


class UserRepository{


    async SignUp(newuser){
        try{
            //1. Get the Database
        const db =  getDB();

        //2. Get the collection
        const collection =  db.collection("users");

        //3. Insert the document.
        await collection.insertOne(newuser);
        return newuser;
        }
        catch(err){
           console.log(err);
            throw new ApplicationError("Something went wrong with Database",500);
        }   
    }

    async SignIn(email, password){
        try{
            //1. Get the Database
        const db =  getDB();

        //2. Get the collection
        const collection =  db.collection("users");

        //3. Insert the document.
        return await collection.findOne({email,password});
   
        }
        catch(err){
           console.log(err);
            throw new ApplicationError("Something went wrong with Database",500);
        }   
    }
    async findByEmail(email){
        try{
            //1. Get the Database
        const db =  getDB();

        //2. Get the collection
        const collection =  db.collection("users");

        //3. Insert the document.
        return await collection.findOne({email});
   
        }
        catch(err){
           console.log(err);
            throw new ApplicationError("Something went wrong with Database",500);
        }   
    }
}

export default UserRepository;