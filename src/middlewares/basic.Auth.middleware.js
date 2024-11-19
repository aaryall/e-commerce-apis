import { UserModel } from "../feature/user/user.model.js";

const basicAuthorizer = (req,res,next)=>{

    const authHeader = req.headers["authorization"]; //In this form postman will send us the data

    //1. Check if authorization header is empty.
    if(!authHeader){
        return res.status(401).send("No auth details found");
    }
    console.log(authHeader);
    //2. Extract credentials. [Basic jsoifsnovbosehnsoiehnog]
        const base64credentials = authHeader.replace('Basic ','');
        console.log(base64credentials)

    //3. decode credentials.
    const decodeCreds = Buffer.from(base64credentials ,'base64').toString('utf-8');
    console.log(decodeCreds); //[username:password]

    const creds = decodeCreds.split(':');  
    const user = UserModel.getAllUsers().find((user)=>{
        return user.email == creds[0] && user.password == creds[1];
    });
    if(user){
        next();
    }
    else{
        return res.status(401).send("Incorrect Credentails");
    }

}

export default basicAuthorizer;