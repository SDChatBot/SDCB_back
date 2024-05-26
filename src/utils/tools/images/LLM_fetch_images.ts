import dotenv from "dotenv";
dotenv.config();

export const GenImg_prompt_En = async (story_slice: string):Promise<string> =>{
   let payload: object = {
      "message": `
            I want you to help me make requests (prompts) for the Stable Diffusion neural network, use English to generate prompt.
            Stable diffusion is a text-based image generation model that can create diverse and high-quality images based on your requests. In order to get the best results from Stable diffusion, you need to follow some guidelines when composing prompts.
            Here are some tips for writing prompts for Stable diffusion1:
            1) Be as specific as possible in your requests. Stable diffusion handles concrete prompts better than abstract or ambiguous ones. For example, instead of “portrait of a woman” it is better to write “portrait of a woman with brown eyes and red hair in Renaissance style”.
            2) Specify specific art styles or materials. If you want to get an image in a certain style or with a certain texture, then specify this in your request. For example, instead of “landscape” it is better to write “watercolor landscape with mountains and lake".
            3) Specify specific artists for reference. If you want to get an image similar to the work of some artist, then specify his name in your request. For example, instead of “abstract image” it is better to write “abstract image in the style of Picasso”.
            4) Weigh your keywords. You can use token:1.3 to specify the weight of keywords in your query. The greater the weight of the keyword, the more it will affect the result. For example, if you want to get an image of a cat with green eyes and a pink nose, then you can write “a cat:1.5, green eyes:1.3,pink nose:1”. This means that the cat will be the most important element of the image, the green eyes will be less important, and the pink nose will be the least important.
            Another way to adjust the strength of a keyword is to use () and []. (keyword) increases the strength of the keyword by 1.1 times and is equivalent to (keyword:1.1). [keyword] reduces the strength of the keyword by 0.9 times and corresponds to (keyword:0.9).

            You can use several of them, as in algebra... The effect is multiplicative.
            (keyword): 1.1
            ((keyword)): 1.21
            (((keyword))): 1.33


            Similarly, the effects of using multiple [] are as follows
            [keyword]: 0.9
            [[keyword]]: 0.81
            [[[keyword]]]: 0.73

            I will also give some examples of good prompts for this neural network so that you can study them and focus on them.

            Examples:
            a cute kitten made out of metal, (cyborg:1.1), ([tail | detailed wire]:1.3), (intricate details), hdr, (intricate details, hyperdetailed:1.2), cinematic shot, vignette, centered
            medical mask, victorian era, cinematography, intricately detailed, crafted, meticulous, magnificent, maximum details, extremely hyper aesthetic
            a girl, wearing a tie, cupcake in her hands, school, indoors, (soothing tones:1.25), (hdr:1.25), (artstation:1.2), dramatic, (intricate details:1.14), (hyperrealistic 3d render:1.16), (filmic:0.55), (rutkowski:1.1), (faded:1.3)
            Jane Eyre with headphones, natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, intricate, elegant, highly detailed, sharp focus, ((((cinematic look)))), soothing tones, insane details, intricate details, hyperdetailed, low contrast, soft cinematic light, dim colors, exposure blend, hdr, faded
            a portrait of a laughing, toxic, muscle, god, elder, (hdr:1.28), bald, hyperdetailed, cinematic, warm lights, intricate details, hyperrealistic, dark radial background, (muted colors:1.38), (neutral colors:1.2)
            
            My query may be in other languages. In that case, translate it into English. Your answer is exclusively in English (IMPORTANT!!!), since the model only understands it.
            Also, you should not copy my request directly in your response, you should compose a new one, observing the format given in the examples.
            Don't add your comments, but answer right away.
            
            My first request is - "{${story_slice}}".`,
      "mode": "chat"
   };
   
   const requestOptions = {
      method: "POST",
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer EV2ZYNX-DBVMRJ0-K8JYKME-36AQGKF',
      },
      body: JSON.stringify(payload),
   };

   try{
      const response = await fetch(process.env.LLM_generate_api!, requestOptions);
      if (response.ok) {
         const story = await response.json();
         return story.textResponse;
      } else {
         throw new Error('GenImg_prompt_En failed with status ' + response.status);
      }
   } catch (error) {
      console.error(`GenImg_prompt_En fail: ${error}`);
      throw error;
   }
}


export let generated_imageprompt_array: string[] = [];

/**
 * 生成圖片prompt(輸出應為英文，這樣才不會出錯)
 */
export const GenImg_prompt_En_array = async (story_array:string[], Response:any) => {
   try{
      for (const story_slice of story_array){
         generated_imageprompt_array.push(await GenImg_prompt_En(story_slice));
      }
      
      generated_imageprompt_array.forEach(val =>{
         console.log(`generated_imageprompt_array = ${generated_imageprompt_array}`);
      })
   }catch(error){
      console.error(`Error in LLMGenStory_1st_2nd: ${error}`);
      Response.status(500).send('Internal Server Error');
   }
};