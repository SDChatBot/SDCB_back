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
exports.DataBase = void 0;
const mongoose_1 = require("mongoose");
const ImagesModel_1 = require("../models/ImagesModel");
const userModel_1 = require("../models/userModel");
const myfavoriteModel_1 = require("../models/myfavoriteModel");
class DataBase {
    constructor(url) {
        this.init(url).then(() => {
            console.log(`success: connect to  ${url}`);
        }).catch(() => {
            console.log(`error: can't connect to ${url}`);
        });
    }
    init(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.DB = yield (0, mongoose_1.connect)(url);
        });
    }
    static SaveNewImage(imageCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let imagename = `${now.getFullYear()}${now.getMonth()}${now.getDay()}_${now.getHours()}${now.getMinutes()}_${now.getSeconds()}`;
            try {
                const image = new ImagesModel_1.ImagesModel({
                    imagesBase64Code: imageCode,
                    imageName: imagename,
                });
                // console.log(`save image success`);
                yield image.save();
            }
            catch (e) {
                console.log(`SaveNewImage fail: ${e}`);
            }
        });
    }
    static SaveNewUser(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new userModel_1.userModel({
                    userName: name,
                    userPassword: password,
                });
                // console.log(`save user success)
                yield user.save();
            }
            catch (e) {
                console.log(`save user fail: ${e}`);
            }
        });
    }
    static SaveNewMyFavorite(Name, is_favorite, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            let addtime = new Date();
            let imagename = `${addtime.getFullYear()}${addtime.getMonth()}${addtime.getDay()}_${addtime.getHours()}${addtime.getMinutes()}_${addtime.getSeconds()}`;
            try {
                const myfavorite = new myfavoriteModel_1.myfavoriteModel({
                    imageName: Name,
                    is_favorite: is_favorite,
                    tagName: tag,
                });
                yield myfavorite.save();
            }
            catch (e) {
                console.log(`SaveNewMyFavorite fail: ${e}`);
            }
        });
    }
}
exports.DataBase = DataBase;
