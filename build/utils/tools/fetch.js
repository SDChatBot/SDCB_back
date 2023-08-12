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
const url = "http://163.13.201.153:7860/"; //http://163.13.201.153:7860/sdapi/v1/txt2img
let imagesBase64;
const fetchImage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    try {
        const response = yield fetch(`${url}sdapi/v1/txt2img`, requestOptions);
        const data = yield response.json();
        imagesBase64 = data.images;
        return data.images; //只回傳image Base64 code
    }
    catch (error) {
        console.log(`Error fetchImage response is ${error}`);
        return `Error => no return `;
    }
});
exports.default = fetchImage;
