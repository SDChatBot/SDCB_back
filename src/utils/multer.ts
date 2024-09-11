import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import multer from "multer";
import dotenv from 'dotenv';
dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.dev_saveRecording!);
    },
    filename: (req, file, cb) => {
        cb(null, "aaa.wav");
    },
});

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(wav|mp3)$/)) {
            cb(null, true)
        } else {
            cb(new Error('Please upload an image'))
        }
    },
});



export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: '未提供認證令牌' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: '無效的認證令牌' });
    }
};

