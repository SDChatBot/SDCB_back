import { Schema, model } from "mongoose";
import { userInterface } from "../interfaces/userInterface";

const userSchema = new Schema<userInterface>({
    userName: {type:String, required: true},
    userPassword: {type:String, require: true},
});

export const userModel = model<userInterface>('users', userSchema);