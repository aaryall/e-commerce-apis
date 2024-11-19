import jwt from 'jsonwebtoken';

const jwtAuth = (req,res,next)=>{
    //1.Read the token
    console.log(req.headers);
    const token = req.headers['authorization'];

    //2. If no Token return the error

    if(!token){
        return res.status(401).send('Unauthorized');
    }

    console.log('Token ',token);
    //3. CHECK if token is valid
    try{
        const payload = jwt.verify(token, "hBRktwLApdTNPUlrpfZO0UtCCyTi4CyZ" );
        console.log(payload);
        req.userId = payload.userID;

    }
    catch(err){

    //4. else return error
        return res.status(401).send('Unauthorize')
    }


    //5. Call next middleware

    next();
}

export default jwtAuth;