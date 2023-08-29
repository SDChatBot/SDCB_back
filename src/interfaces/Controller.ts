import { Request, Response } from "express";

export abstract class Controller {
    public abstract test(Request: Request, Response: Response): void
}