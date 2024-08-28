import { spawn } from 'child_process'; // child_processDo
import dotenv from 'dotenv';
dotenv.config();

export const trainVoiceModel = async () => {
    return new Promise((resolve, reject) => {
        const processDo = spawn('echo', ['你好'], {
            shell: true,
            cwd: process.env.gptsovits_dir_path!
        });

        processDo.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        processDo.stderr.on('data', (data) => {
            console.error(`stderr: ${data.toString()}`);
        });

        processDo.on('close', (code) => {
            if (code === 0) {
                console.log(`Child process exited with code ${code}`);
                resolve('Command executed successfully');
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
};