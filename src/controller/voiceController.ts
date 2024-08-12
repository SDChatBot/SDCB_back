import { Controller } from "../interfaces/Controller";
import { Request, Response } from "express";
import { DataBase } from "../utils/DataBase";
import express from 'express';
import { spawn } from 'child_process'; // child_process

///aaaa
export class VoiceController extends Controller{
    public test(Request:Request, Response:Response){
        Response.send(`This is VoiceController`);
    }

    public UploadVoice(Request: Request, Response:Response){
        // /Volumes/ssdEnclosur/projects/Whispertales/Whispertales_back/src/save/test
        if(!Request.file){
            return Request.status(400).send("no file uploaded.");
        }
        const filePath = "/Volumes/ssdEnclosur/projects/Whispertales/Whispertales_back/src/save/test";
        const fileName = "newfile.txt";
        const echo = spawn('sh', ['-c', `echo "This is file aaa" > ${filePath}/${fileName}`]);

        echo.on('error', (error) => {
            console.error(`Error creating file: ${error.message}`);
        });

        echo.on('close', (code) => {
            if (code === 0) {
                console.log(`File ${fileName} created successfully in ${filePath}`);
            } else {
                console.log(`Process exited with code: ${code}`);
            }
        });

        Response.send("Hi");
    }

    // public UploadVoice(){
    //     // 3. 路由中接收上傳的檔案，目前先設為接收單一上傳檔案
    //     const app = express();
    //     app.post('前端HTML表單提交檔案的路徑',upload.single('audio'), (req, res) => { // .single('audio')接收來自名為audio欄位的「單一」上傳檔案，並將檔案資訊存放在 req.file 上
    //                                             // 待修改 -> '前端HTML表單提交檔案的路徑' 為HTML <form>中的action屬性值
    //                                             // 待修改 -> 'audio' 為前端表單(form)裡面，<input>標籤的name屬性 為資料的名稱（fieldname）
    //         if(!req.file){
    //             return res.status(400).send('no file uploaded.');
    //         }
    //
    //         // 使用CommandLine完成數據集的音檔切割處理的方式
    //         // 設定：音檔輸入＆切割後音檔輸出
    //         const inputFile = req.file.path; //不用改
    //         const outputDir = '/home/b310-21/projects/GPT-SoVITS/output/slicer_opt'; // 輸出的切割後的音檔應存入的目錄
    //
    //         // 進行音檔切割、調整
    //         const CommandLine = spawn('python', [
    //             'audio_slicer.py',
    //             '--input_path',  inputFile,     // 前端所傳來的訓練用音檔
    //             '--output_root', outputDir,     // 將音檔切割後的切割後音檔所輸出的目錄
    //             '--threshold', '30',
    //             '--min_length', '3000',
    //             '--min_interval', '300',
    //             '--hop_size', '10'
    //         ]) ;
    //
    //         CommandLine.stdout.on('data', (data) => { //標準輸出
    //             console.log(`音檔切割輸出: ${data}`);
    //         });
    //         CommandLine.stderr.on('data', (data) => { //標準錯誤
    //             console.log(`stderr: ${data}`);
    //         });
    //         CommandLine.on('close', (code) => {
    //             if(code !==0){                          //  code為1，錯誤：音檔切割進程退出
    //                 console.log(` child process exited with code ${code}`);
    //                 return res.status(500).send('Error processing audio file');
    //             }
    //             // code為0，正常執行
    //             console.log('音檔切割完成 開始ASR處理');
    //
    //             //呼叫函數以進行ASR處理 //FunASR(outputDir, res);
    //
    //             // 使用CommandLine完成數據集ASR處理的方式
    //             const asr = spawn('python', [
    //                 'tools/asr/funasr_asr.py',
    //                 '-i', outputDir, // 同前面：將音檔切割後的切割後音檔所輸出的目錄
    //                 '-o', `projects/GPT-SoVITS/output/asr_opt` // 輸出目錄設定為GPT-SoVITS預設之output/asr_opt資料夾（存放轉為文字的list檔案）
    //             ]);
    //
    //             asr.stdout.on('data', (data) => { //標準輸出
    //             console.log(`ASR處理輸出: ${data}`);
    //             });
    //             asr.stderr.on('data', (data) => { //標準錯誤
    //                 console.log(`stderr: ${data}`);
    //             });
    //             asr.on('close', (code) => {
    //                 if(code !==0){
    //                     console.log(` child process exited with code ${code}`); // ASR進程退出
    //                     return res.status(500).send('Error processing ASR');
    //                 }
    //             });
    //
    //             res.send('');
    //
    //             //訓練模型
    //             const ASRoutput = 'projects/GPT-SoVITS/output/asr_opt';
    //             const train = spawn('python', [
    //                 's1_train.py',
    //                 '-c', 'configs/s1longer.yaml',
    //                 '--train_semantic_path', ASRoutput, // 標註文件的所在路徑
    //                 '--train_phoneme_path', outputDir, // 切割後的音檔的所在路徑
    //                 // 這邊還有 output 部分沒寫
    //
    //             ])
    //         });
    //
    //     });
    // }

    //     // "輸出的音檔應存入的目錄" -> 待修改 -> 存在預設的 output/slicer_opt
}