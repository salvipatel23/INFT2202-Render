/*
 * Name: Salvi Patel
 * Course Code - INFT 2202-02
 * In Class-4 : Mongoose and MongoDB Atlas
 * Date: April 17, 2024
*/

"use strict"

// importing mongoose from mongoose
import mongoose from "mongoose";

const Schema  = mongoose.Schema;

// importing passportLocalMongoose
import passportLocalMongoose from "passport-local-mongoose";

// defining new Schema
const UserSchema: any = new Schema(
    {
        DisplayName:String,
        EmailAddress:String,
        Username: String,
        Created: {
            type: Date,
            default : Date.now()
        }
    },
    {
        collection : "users"
    }
)

// User.Schema.plugin
UserSchema.plugin(passportLocalMongoose);
const Model = mongoose.model("User", UserSchema);



declare global{
    export  type UserDocument = mongoose.Document &
        {
            username : string,
            EmailAddress :string,
            DisplayName: string
        }
}
export default Model;

