import { MongoClient } from "mongodb";

//Using dotenv library to make all enviroment variable 

let client;
export const connectToMongoDB = () =>{
    MongoClient.connect(process.env.DB_URL) //process.env.DB_URL - Enviroment variable in .env file has database connection string
            .then(clientInstance =>{
                client = clientInstance;
                console.log('Mongodb is connected');
                createCounter(client.db());
                createIndexes(client.db());
            })
            .catch(err=>{
                console.log(err);
            })
}

export const getClient =() =>{
    return client;
}
export const getDB = ()=>{
    return client.db();
}

const createCounter = async(db)=>{
    const existingCounter = await db.collection("counters").findOne({_id:'cartItemId'});
    console.log(existingCounter);
    if(!existingCounter){
        //console.log('Inside');
        await db.collection("counters").insertOne({
            _id:'cartItemId', value: 0
        });
    }
}

const createIndexes = async(db) =>{
    try {
        await db.collection("products").createIndex({price:1});
        await db.collection("products").createIndex({name:1 , category: -1});
        await db.collection("products").createIndex({desc:"text"});


    } catch (error) {
        console.log(error);
    }   
    console.log("Indexes are created");
    
}

