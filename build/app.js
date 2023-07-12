"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DataBase_1 = require("./utils/DataBase");
const app = (0, express_1.default)();
const port = 713;
const DB = new DataBase_1.DataBase("mongodb://192.168.1.25:2425");
app.set("view engine", "ejs");
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/index', (req, res) => {
    //res.send('index')
    res.render("index");
});
app.listen(port, () => {
    console.log(`Use this url: http://127.0.0.1:${port}`);
});
