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
const DecodeBase64_1 = __importDefault(require("./DecodeBase64"));
const url = "http://163.13.201.153:7860/"; //http://163.13.201.153:7860/sdapi/v1/txt2img
const payload = {
    prompt: "a cut cat",
    seed: -1,
    cfg_scale: 7,
    step: 1,
};
let imagesBase64;
const fetchImage = () => __awaiter(void 0, void 0, void 0, function* () {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    try {
        const response = yield fetch(`${url}sdapi/v1/txt2img`, requestOptions);
        const data = yield response.json();
        imagesBase64 = data.images;
        (0, DecodeBase64_1.default)(data.images);
        return data.images;
    }
    catch (error) {
        console.log(`Error fetchImage response is ${error}`);
        return `Error => no return `;
    }
});
exports.default = fetchImage;
