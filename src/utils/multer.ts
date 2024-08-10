import fetch from 'node-fetch';
import multer from "multer";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.dev_saveRecording!);
    },
    filename: (req, file, cb) => {
        cb(null, "aaa.wav");
    },
});

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(wav|mp3)$/)) {
            cb(null, true)
        } else {
            cb(new Error('Please upload an image'))
        }
    },
});

// //接收前端的傳來的音檔
//
// // 1. 儲存檔案
// const recording = process.env.dev_saveRecording || 'src/save/recording';
// const multerStorage = multer.diskStorage({
//     //路徑
//     destination: (req, file, cb) => {
//         cb(null, recording) //錄音檔案暫定存在 src/recording 中
//     },
//     //檔名
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
//     }
// })
//
//
// // 2. 建立 multer ＆ 設置 multer 屬性
// const upload = multer({
//     storage: multerStorage
// })
//
// export default upload;

