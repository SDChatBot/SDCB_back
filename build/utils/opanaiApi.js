"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAnswer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const chatgpt_1 = require("chatgpt");
//const ChatGPTAPI = require('chatgpt');
const api = new chatgpt_1.ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY || ""
});
const AiAnswer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield api.sendMessage(`Hello World`);
        console.log(`AI 的回答是: ${res.text}`);
        return res.text;
    }
    catch (_a) {
        console.log(``);
        return "";
    }
});
exports.AiAnswer = AiAnswer;
