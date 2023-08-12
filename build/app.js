"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DataBase_1 = require("./utils/DataBase");
const fetch_1 = __importDefault(require("./utils/tools/fetch"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 810;
const DB = new DataBase_1.DataBase("mongodb://sdcb:sdcbpassword@192.168.1.26:2425");
const corsOptions = {
    origin: [
        'http://localhost:707',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.get('/image', (req, res) => {
    res.send('Hello World');
});
app.post('/image', (req, res) => {
    const imageData = req.body;
    //console.log(`imageData = ${JSON.stringify(req.body)}`);
    let payload = {
        prompt: imageData.prompt,
        seed: -1,
        cfg_scale: 7,
        step: 2,
    };
    try {
        (0, fetch_1.default)(payload).then((val) => {
            //console.log(val)
            let imageSaveData = `${val}`;
            //console.log(`imageSaveData = ${imageSaveData}`)
            DataBase_1.DataBase.SaveNewImage(imageSaveData);
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
app.listen(port, () => {
    console.log(`Use this url: http://127.0.0.1:${port}/image`);
    console.log(`http://127.0.0.1:${port}/image`);
});
