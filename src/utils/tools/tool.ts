import { getVoices } from "../tools/fetch";
import fs from 'fs/promises';
import path from 'path';  

export const CurrentTime = () =>{
    const now=new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedTime = `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    return formattedTime;
}

export const GenVoice = async (storyId:string, storyTale:string) => {
    try {
        const { audioFileName, audioBuffer } = await getVoices(storyId, storyTale);
        const filePath = path.join(process.env.dev_saveAudio!, audioFileName);
        await fs.writeFile(filePath, Buffer.from(audioBuffer));
        
        console.log(`Voice generated successfully, and saved success`);
        // let playload = {
        //     success: true,
        //     message: "Voice generated successfully",
        //     audioFilePath: filePath,
        //     audioFileName: audioFileName
        // }
        // return playload;

    } catch (error) {
        console.error("Error in GenVoice: ", error);
        // let playload = {
        //     success: false,
        //     message: `Voice generated fail with error: ${error}`,
        // }
        // return playload;
    }
}

