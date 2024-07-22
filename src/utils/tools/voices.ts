//傳入故事生成聲音保存在遠端本機資料夾中
import { getVoice } from "./fetch";

export const GenVoice = (generated_story_array: Array<string>, Saved_storyID:string) =>{
    generated_story_array.forEach(element => {
        getVoice()
    });
}