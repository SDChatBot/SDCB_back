import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { DataBase } from "../utils/DataBase";
import { userInterface } from "../interfaces/userInterface";

export class UserController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`This is userController`);
    }

    public AddUser(Request:Request, Response:Response){
        let username:string = Request.body.userName!;
        let userpassword:string = Request.body.userPassword!;
        DataBase.SaveNewUser(username, userpassword).then(()=>{
            console.log(`save new user success`);
            Response.send(`save new user success`);
        }).catch((e)=>{
            console.error(`save user fail: ${e}`);
        })
    }
}