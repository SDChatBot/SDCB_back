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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMGenStory = void 0;
const LLM_generate_api = `http://163.13.201.153:11434/api/generate`; //generation only, no chatting function
const LLM_chat_api = `http://163.13.201.153:11434/api/chat`; //has chatting function
const aa = JSON.stringify({
    "model": "breeze-7b-instruct-v1_0-q6_k.gguf:latest",
    "prompt": "有一個戴著藍色帽子的小女孩，他最喜歡的食物是榴槤，他跟他的奶奶生活在一起，他奶奶有90歲了。請問小女孩戴甚麼顏色的帽子",
    "stream": false,
    "format": "json"
});
const LLMGenStory = () => __awaiter(void 0, void 0, void 0, function* () {
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: aa,
    };
    try {
        const response = yield fetch(LLM_generate_api, requestOptions);
        if (response.ok) {
            const jsonResponse = yield response.json();
            console.log(`response: ${JSON.stringify(jsonResponse)}`);
            return jsonResponse.response;
        }
        else {
            throw new Error('Request failed with status ' + response.status);
        }
    }
    catch (error) {
        console.error(`LLMGenStory fail: ${error}`);
    }
});
exports.LLMGenStory = LLMGenStory;
