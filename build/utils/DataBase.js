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
const storyModel_1 = require("../models/storyModel");
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
    static SaveNewStory(storyTale, storyInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const story = new storyModel_1.storyModel({
                    storyTale: storyTale,
                    storyInfo: storyInfo,
                });
                console.log(`save newstory success`);
                yield story.save();
            }
            catch (e) {
                console.log(`SaveNewStory fail, error:${e}`);
            }
        });
    }
    static getStoryById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storytail = yield storyModel_1.storyModel.findOne({ _id });
                console.log(typeof storytail);
                return storytail;
            }
            catch (e) {
                console.log(`getStoryById fail, ${e}`);
            }
        });
    }
}
exports.DataBase = DataBase;
