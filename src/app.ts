import express from 'express';
import { DataBase } from './utils/DataBase';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from './Routers';

const app = express()
const port = 7943
const portSocket = 2764
const ip2 = "163.13.201.153";
const DB = new DataBase("mongodb://163.13.201.153:2425/");



//socketio client api Dev
const socket_client = `http://localhost:666`;

// //Use2
// const socket_client = `http://163.13.201.153:666`;


// //use
// httpServer.listen(portSocket, ip, () => {
//     console.log(`Socket Server: http://${ip}:${portSocket}`);
// });

//***************************************************************************************************//

//系統伺服器
const corsOptions = {
    origin: [
        'http://localhost:666', //dev front 
        'http://192.168.1.26:666', //use front     
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