"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToSpeech = void 0;
const sdk = __importStar(require("microsoft-cognitiveservices-speech-sdk"));
const stream_1 = require("stream");
const textToSpeech = (key, region, text, CHAR) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        console.log(key);
        const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
        speechConfig.speechSynthesisOutputFormat = 5; // mp3
        // speechConfig.speechSynthesisVoiceName = "zh-CN-YunhaoNeural"; 
        // speechConfig.speechSynthesisVoiceName = "zh-CN-YunxiNeural"; 
        speechConfig.speechSynthesisVoiceName = CHAR;
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
        synthesizer.speakTextAsync(text, result => {
            const { audioData } = result;
            synthesizer.close();
            const bufferStream = new stream_1.PassThrough();
            bufferStream.end(Buffer.from(audioData));
            const chunks = [];
            bufferStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            bufferStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64Data = buffer.toString('base64');
                resolve(base64Data);
            });
        }, error => {
            synthesizer.close();
            reject(error);
        });
    });
});
exports.textToSpeech = textToSpeech;
