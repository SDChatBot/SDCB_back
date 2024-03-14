import multer from "multer";
import path from "path";

import dotenv from 'dotenv';
dotenv.config();

export let imageName:string;

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      imageName = file.originalname;
      cb(null, `${process.env.dev_saveImage}`);
   },
   filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);
   }
});

const fileFilter = function (req: any, file:any, cb:any) {
   if (path.extname(file.originalname).toLowerCase() == ".jpg" || path.extname(file.originalname).toLowerCase() == ".png") {
      cb(null, true);
   } else {
      cb(new Error('Wrong image type, please confirm the uploaded file'), false);
   }
};


export const upload = multer({
   storage: storage,
   fileFilter: fileFilter
});