"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DataBase_1 = require("./utils/DataBase");
const fetch_1 = require("./utils/tools/fetch");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const opanaiApi_1 = require("./utils/opanaiApi");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const port = 7943;
const portSocket = 450;
const ip = "192.168.1.26";
const DB = new DataBase_1.DataBase("mongodb://192.168.1.26:2425");
const httpServer = (0, http_1.createServer)();
//socketio client api
const socket_client = `http://localhost:3000`;
//const socket_client = `http://localhost:6532`;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: socket_client,
        methods: ["GET", "POST"],
    }
});
//聊天室socket伺服器
io.on('connection', (socket) => {
    console.log(`connected ${socket_client} success`);
    let botRoomId;
    // create a new room for the user and bot to chat
    botRoomId = 'bot_room_' + Math.random().toString(36).substr(2, 9);
    socket.join(botRoomId);
    // listen for chat message from user and send it to bot
    socket.on('chat message', (msg) => {
        console.log(`User said: ${msg}`); // log the message to the console
        // handle user's message here
        // simulate bot's reply
        const botReply = 'Hello, I am a bot.';
        // send bot's reply to all connected users in the room
        io.to(botRoomId).emit('chat message', botReply);
    });
});
// dev
httpServer.listen(portSocket, () => {
    console.log(`Socket Server: http://localhost:${portSocket}`);
});
// // Use
// httpServer.listen(portSocket, () => {
//     console.log(`Socket Server: http://${ip}:${portSocket}`);
// });
//***************************************************************************************************//
//系統伺服器
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://192.168.1.26:3000', //use front     
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
//app.route()方法
app.route('/image')
    .get((req, res) => {
    res.send('Hello World');
})
    .post((req, res) => {
    const imageData = req.body;
    //console.log(`imageData = ${JSON.stringify(req.body)}`);
    let payload = {
        prompt: imageData.prompt,
        seed: -1,
        cfg_scale: 7,
        step: 2,
    };
    try {
        (0, fetch_1.fetchImage)(payload).then((val) => {
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
app.post('/aianswer', (req, res) => {
    try {
        (0, opanaiApi_1.AiAnswer)().then((val) => {
            res.send(val);
        }).catch((e) => {
            console.log(`aiapi answer error: ${e}`);
        });
    }
    catch (e) {
        console.log(`/aianswer post error: ${e}`);
    }
});
//dev 開發
app.listen(port, () => {
    console.log(`Server: http://127.0.0.1:${port}/image`);
});
// //use 使用
// app.listen(port, ip,() => {
//     console.log(`Server: http://${ip}:${port}/image`)
// });
