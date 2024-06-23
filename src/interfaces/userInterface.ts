import { storyInterface } from "./storyInterface";

export interface userInterface {
    userName: string,
    userPassword: string,
    booklist: Array<string>, //僅存放stories 的id
}