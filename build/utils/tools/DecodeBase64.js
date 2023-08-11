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
//Buffer是 Node.js中將字符串轉成二進制的方法
const Base64_To_Image = (Base64Code) => __awaiter(void 0, void 0, void 0, function* () {
    const bufferData = Buffer.from(Base64Code, 'base64');
    // 將圖片寫入本地文件
    //fs.writeFileSync('D:/NewCodeFile/SDCB/GitHub_SDCB/SDCB_back/src/images/image.png', bufferData); 
});
exports.default = Base64_To_Image;
