import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { DataBase } from "../utils/DataBase";

export class UserController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`This is userController`);
    }

    
    public AddUser(Request:Request, Response:Response){
        if (!Request.body.userName.ok || !Request.body.userPassword){
            console.error(`userName or userPassword lost, fuck u`);
            Response.status(403).send(`userName or userPassword error`);
        }
        let username:string = Request.body.userName;
        let userpassword:string = Request.body.userPassword;
        DataBase.SaveNewUser(username, userpassword).then(()=>{
            console.log(`save new user success`);
            Response.send(`save new user success`);
        }).catch((e)=>{
            console.error(`save user fail: ${e}`);
        })
    }

    public DelUser(Request: Request, Response: Response) {
        let username: string = Request.body.userName!;
        DataBase.DelUser(username).then(() => {
            console.log(`delete user success`);
            Response.send(`delete user success`);
        }).catch((e) => {
            console.error(`delete user fail: ${e}`);
        })
    }
}