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
    } catch (error) {
        console.error("Error in GenVoice: ", error);
    }
}

//  判斷物件內的屬性是否都存在
export function isObjectValid(obj: any | null | undefined): boolean {
    if (!obj) return false;
    
    // 該函式會返回 true 如果物件的每個屬性都不為 null、undefined
    return Object.values(obj).every(value => 
        value !== null && 
        value !== undefined && 
        (Array.isArray(value) ? value.length > 0 : true)
    );
}
