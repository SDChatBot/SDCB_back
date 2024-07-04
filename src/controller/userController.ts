import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { DataBase } from "../utils/DataBase";

export class UserController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`This is userController`);
    }

    
    public async AddUser(Request:Request, Response:Response){
        const { userName, userPassword } = Request.body;
        if (!userName || !userPassword) {
            console.error('userName or userPassword lost');
            return Response.status(400).send('userName or userPassword error');
        }
        try {
            const result = await DataBase.SaveNewUser(userName, userPassword);
            if (result.success) {
                console.log(result.message);
                return Response.status(200).send(result.message);
            }else if(result.code==401 && result.code){
                console.error(result.message);
                return Response.status(result.code).send(result.message);
            } else {
                console.error(result.message);
                return Response.status(400).send(result.message);
            }
        } catch (e:any) {
            console.error(`AddUser fail: ${e.message}`);
            return Response.status(500).send('AddUser fail');
        }
    }

    public DeleteUser(Request: Request, Response: Response) {
        const { username } = Request.body;
        if (!username) {
            console.error('userName is required to delete a user');
            return Response.status(400).send('userName is required');
        }
        DataBase.DelUser(username).then((result:any) => {
            if (result.success) {
                console.log(result.message);
                return Response.status(200).send(result.message);
            } else {
                console.error(result.message);
                return Response.status(404).send(result.message);
            }
        }).catch((e:any) => {
            console.error(`DeleteUser fail: ${e.message}`);
            return Response.status(403).send('AddUser fail');
        })
    }

    public AddFavorite(Request: Request, Response: Response) {
        //let Book: storyInterface = Request.body;
        const BookID = Request.query.bookid;
        if(!BookID){
            Response.status(403).send(`wrong bookID`);
        }
        DataBase.AddFav(BookID as string).then(() => {
            console.log(`Successfully added book to favorite`);
            Response.send(`Successfully added book to favorite`);
        }).catch((e) => {
            console.error(`Failed added book to favorite`);
        })
    }
}