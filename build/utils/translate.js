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
exports.TranslateZh = exports.TranslateEn = void 0;
const translator = require('node-google-translate-skidz');
//中文轉英文
function TranslateEn(originalString) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            translator({
                text: originalString,
                source: 'zh',
                target: 'en'
            }, (result) => {
                //console.log(`result.translation = ${result.translation}`);
                resolve(result.translation);
            });
        });
    });
}
exports.TranslateEn = TranslateEn;
//英文轉中文
function TranslateZh(originalString) {
    translator({
        text: originalString,
        source: 'en',
        target: 'zh'
    }, (result) => {
        return result;
    });
}
exports.TranslateZh = TranslateZh;
