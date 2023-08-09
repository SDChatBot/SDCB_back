"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DataBase_1 = require("./utils/DataBase");
const fetch_1 = __importDefault(require("./utils/tools/fetch"));
const app = (0, express_1.default)();
const port = 7809;
const DB = new DataBase_1.DataBase("mongodb://192.168.1.26:2425");
app.use((req, res, nest) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:707');
});
app.set("view engine", "ejs");
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.post('/image', (req, res) => {
    try {
        (0, fetch_1.default)().then((val) => {
            //console.log(val)
            res.json(val);
        }).catch((e) => {
            console.log(`run time error`);
        });
        //res.send(fetchImage());
    }
    catch (e) {
        console.log(`fetchImage fail: ${e}`);
        res.status(500).send('/image post run wrong ');
    }
});
app.get('/index', (req, res) => {
    //res.send('index')
    res.render("index");
});
app.listen(port, () => {
    console.log(`Use this url: http://127.0.0.1:${port}`);
    console.log(`http://127.0.0.1:${port}/image`);
});
