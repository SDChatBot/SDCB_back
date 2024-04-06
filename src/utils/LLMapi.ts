import { response } from "express";
import { ConsoleLoggingListener } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.browser/ConsoleLoggingListener";

const LLM_generate_api = `http://163.13.201.153:11434/api/generate`; //generation only, no chatting function
const LLM_chat_api = `http://163.13.201.153:11434/api/chat`; //has chatting function

const aa = JSON.stringify({
    "model": "breeze-7b-instruct-v1_0-q6_k.gguf:latest",
    "prompt": "有一個戴著藍色帽子的小女孩，他最喜歡的食物是榴槤，他跟他的奶奶生活在一起，他奶奶有90歲了。請問小女孩戴甚麼顏色的帽子",
    "stream": false,
    "format": "json"
  })
  

export const LLMGenStory = async() =>{
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: aa,
    };
    try {
        const response = await fetch(LLM_generate_api, requestOptions); 
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(`response: ${JSON.stringify(jsonResponse)}`);
            return jsonResponse.response;
        } else {
            throw new Error('Request failed with status ' + response.status);
        }
    } catch (error) {
        console.error(`LLMGenStory fail: ${error}`);
    }
}