import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { DataBase } from "../utils/DataBase";
import { books } from "../interfaces/books";

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

    public AddFavorite(Request: Request, Response: Response) {
        try {
            let Book: books = Request.body.book;
            Book.is_favorite = true;
            console.log(`Successfully added book to favorite`);
            Response.send(`Successfully added book to favorite`);
        } catch (e) {
            console.error(`Failed added book to favorite`);
        }
    }

    public RemoveFavorite(Request: Request, Response: Response) {
        try {
            let Book: books = Request.body.book;
            Book.is_favorite = false;
            console.log(`Successfully removed book to favorite`);
            Response.send(`Successfully removed book to favorite`);
        } catch (e) {
            console.error(`Failed removed book to favorite`);
        }
    }
}