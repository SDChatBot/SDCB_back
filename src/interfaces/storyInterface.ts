export interface storyInterface{
   storyTale:string,
   storyInfo:string,
   image_prompt?:string[]
   image_base64?:string[]
   is_favorite: boolean,
   addDate: Date,
}