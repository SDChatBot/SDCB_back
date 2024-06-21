import { myfavoriteInterface } from "../interfaces/myfavoriteInterface";
import { books } from "../interfaces/books";

export interface userInterface {
    userName: string,
    userPassword: string,
    favorite?: myfavoriteInterface,
    book?: books[],
}