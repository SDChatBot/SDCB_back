"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DataBase_1 = require("./utils/DataBase");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const opanaiApi_1 = require("./utils/opanaiApi");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const Routers_1 = require("./Routers");
const app = (0, express_1.default)();
const port = 7943;
const portSocket = 2764;
const ip = "192.168.1.26";
const ip2 = "163.13.201.153";
const DB = new DataBase_1.DataBase("mongodb://192.168.1.26:2425");
const httpServer = (0, http_1.createServer)();
//socketio client api Dev
const socket_client = `http://localhost:666`;
// // Use
// const socket_client = `http://192.168.1.26:666`;
// //Use2
// const socket_client = `http://163.13.201.153:666`;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: socket_client,
        methods: ["GET", "POST"],
    }
});
//let UserPromptSupport:string=`你現在的角色為一位國小美術老師，我是你的學生，我會告訴你我的創作想法。請你用100字上下，活潑，輕鬆的語氣誇獎我的想法或是建議我怎麼去改善我的想法。`
//聊天室socket伺服器
io.on('connection', (socket) => {
    console.log(`connected Socketio ${socket_client} success`);
    let botRoomId;
    // create a new room for the user and bot to chat
    botRoomId = 'bot_room_' + Math.random().toString(36).substr(2, 9);
    socket.join(botRoomId);
    // listen for chat message from user and send it to bot
    socket.on('chat message', (msg) => {
        //console.log(`User said: ${msg}`);
        try {
            (0, opanaiApi_1.AiAnswer)(msg).then((botReply) => {
                // send bot's reply to all connected users in the room
                io.to(botRoomId).emit('chat message', botReply);
            }).catch((e) => {
                console.log(`get AiAnswer fail, ${e}`);
            });
        }
        catch (e) {
            console.log(`AiAnswer error: ${e}`);
        }
    });
});
// dev
httpServer.listen(portSocket, () => {
    console.log(`Socket Server: http://localhost:${portSocket}`);
});
// //use
// httpServer.listen(portSocket, ip, () => {
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
for (const route of Routers_1.router) {
    app.use(route.getRouter());
}
//=============================================
//dev 開發
app.listen(port, () => {
    console.log(`Server: http://127.0.0.1:${port}/image`);
});
// //use 使用
// app.listen(port, ip,() => {
//     console.log(`Server: http://${ip}:${port}/image`)
// });
// //use2 使用2
// app.listen(port, ip2, () => {
//     console.log(`Server: http://${ip}:${port}/image`)
// });
