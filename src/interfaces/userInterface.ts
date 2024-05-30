import { myfavoriteInterface } from "../interfaces/myfavoriteInterface";

export interface userInterface{
    userName: string,
    userPassword: string,
    favorite?: myfavoriteInterface,
}