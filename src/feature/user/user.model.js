import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


export class UserModel{
    constructor(name, email , password , type){
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
    }
}
var users = [{
    "id":"1",
    "name":"Seller User",
    "email":"Sellr@login.com",
    "password":"Pass",
    "type":"Seller"
}]