"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.imageName = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        exports.imageName = file.originalname;
        cb(null, `${process.env.dev_saveImage}`);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`);
    }
});
const fileFilter = function (req, file, cb) {
    if (path_1.default.extname(file.originalname).toLowerCase() == ".jpg" || path_1.default.extname(file.originalname).toLowerCase() == ".png") {
        cb(null, true);
    }
    else {
        cb(new Error('Wrong image type, please confirm the uploaded file'), false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter
});
