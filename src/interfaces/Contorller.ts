import { Request,Response } from "express";

export abstract class Contorller{
    public abstract test(Request:Request, Response:Response):void
}