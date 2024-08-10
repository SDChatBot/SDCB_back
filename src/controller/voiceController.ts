import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { DataBase } from "../utils/DataBase";

export class VoiceController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`This is VoiceController`);
    }
}