import express from 'express';
import { DataBase } from './utils/DataBase';
import { fetchImage } from './utils/tools/fetch';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AiAnswer } from './utils/opanaiApi';
import http, { createServer } from 'http';
import { Server } from "socket.io";
import { router } from './Routers';

const app = express()
const port = 7943
const portSocket = 2764
const ip = "192.168.1.26";
const ip2 = "163.13.201.153";
const DB = new DataBase("mongodb://192.168.1.26:2425");
const httpServer = createServer();



//socketio client api Dev
const socket_client = `http://localhost:666`;

// // Use
// const socket_client = `http://192.168.1.26:666`;

// //Use2
// const socket_client = `http://163.13.201.153:666`;

const io = new Server(httpServer, {
    cors: {
        origin: socket_client,
        methods: ["GET", "POST"],
    }
});

//let UserPromptSupport:string=`你現在的角色為一位國小美術老師，我是你的學生，我會告訴你我的創作想法。請你用100字上下，活潑，輕鬆的語氣誇獎我的想法或是建議我怎麼去改善我的想法。`

//聊天室socket伺服器
io.on('connection', (socket) => {
    console.log(`connected Socketio ${socket_client} success`);
    let botRoomId: any;
    // create a new room for the user and bot to chat
    botRoomId = 'bot_room_' + Math.random().toString(36).substr(2, 9);
    socket.join(botRoomId);
    // listen for chat message from user and send it to bot
    socket.on('chat message', (msg) => {
        //console.log(`User said: ${msg}`);
        try {
            AiAnswer(msg).then((botReply) => {
                // send bot's reply to all connected users in the room
                io.to(botRoomId).emit('chat message', botReply);
            }).catch((e) => {
                console.log(`get AiAnswer fail, ${e}`);
            });
        } catch (e) {
            console.log(`AiAnswer error: ${e}`)
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
        'http://localhost:3000', //dev front 
        'http://192.168.1.26:3000', //use front     
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
for (const route of router) {
    app.use(route.getRouter())
}

//=============================================
//dev 開發
app.listen(port, () => {
    console.log(`Server: http://127.0.0.1:${port}/image`)
});

// //use 使用
// app.listen(port, ip,() => {
//     console.log(`Server: http://${ip}:${port}/image`)
// });

// //use2 使用2
// app.listen(port, ip2, () => {
//     console.log(`Server: http://${ip}:${port}/image`)
// });