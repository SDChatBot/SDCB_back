import dotenv from "dotenv";
dotenv.config();

/**
 * 更改sd option，使用想要的模型生成圖片
 * @param MODEL_NAME 要使用的sd 模型名稱
 */
export const sdModelOption = async (MODEL_NAME:string) =>{
   try {
      let payload = {
         "sd_model_checkpoint":""
      };
      payload["sd_model_checkpoint"] = MODEL_NAME;

      const updateOptions = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload),
      };
      const updateResponse = await fetch(`${process.env.stable_diffusion_api}/sdapi/v1/options`, updateOptions);
      if (!updateResponse.ok) {
         throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }
      return { code: 200, message:`Model option updated successfully`}
   } catch (error: any) {
      return { code: 405, message: `Error in sdModelOption: ${error.message}` };
   }
}

export const getSDModelList = async () => {
   try {
      const response = await fetch(`${process.env.stable_diffusion_api}/sdapi/v1/sd-models`);
      if (!response.ok) {
         throw new Error(`sd get models error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
   } catch (error: any) {
      console.error(`Error in getSDModelList: ${error.message}`);
      throw new Error(`getSDModelList error! status: ${error.message}`);
   }
}

export const GenImg_prompt_En = async (story_slice: string):Promise<string> =>{
   const controller:AbortController = new AbortController();
   const timeoutId = setTimeout(()=>controller.abort(), 25000);

   let payload: object = {
      "model": "llama3.1_8b_chinese_chat_q8_0.gguf:latest",
      "prompt": `
            I want you to help me make english requests (prompts) for the Stable Diffusion neural network, use English to generate prompt.
            Stable diffusion is a text-based image generation model that can create diverse and high-quality images based on your requests. In order to get the best results from Stable diffusion, you need to follow some guidelines when composing prompts.
            Here are some tips for writing prompts for Stable diffusion1:
            1) I only need the prompt. Just provide the prompt without any suggestions, questions, improvements, or additional text. Please respond in English, as the model only understands English and your response in Chinese will not help me. Additionally, my request will only be brief text. Although I understand that the model needs more detailed prompts to generate better images, it is your job to extend the prompt from my given request, which is why I have provided you with the following instructions. Therefore, just give me the generated prompt result. Do not question whether my request is detailed enough, as that is not your job. Examples: "a cute kitten made out of metal, (cyborg:1.1), ([tail | detailed wire]:1.3), (intricate details), hdr, (intricate details, hyperdetailed:1.2), cinematic shot, vignette, centered", "medical mask, victorian era, cinematography, intricately detailed, crafted, meticulous, magnificent, maximum details, extremely hyper aesthetic"
            2) Describe your request as specifically as possible so that Stable Diffusion can better understand what kind of image to generate. Here are some examples for reference: Example 1: write "a woman with brown eyes and red hair, 13 years old." is better than writing "a woman,". Example 2: write "a gray Mercedes that looks very grand and luxurious." is better than writing "a car".  Example 3: write "a beautiful blonde girl with blue eyes crying pitifully." is better than writing "a girl crying". Don't worry, you can do it. You're great, you can definitely do it.
            3) When I specify a particular art style, you should include these specific art style keywords in the generated prompt. Otherwise, do not include any specific art style keywords on your own, as this may cause inconsistency in the artistic style when generating multiple images. This is not the outcome I desire, so please do not add any style-related keywords unless explicitly instructed.
            4) Weigh your keywords. You can use token:1.3 to specify the weight of keywords in your query. The greater the weight of the keyword, the more it will affect the result. For example, if you want to get an image of a cat with green eyes and a pink nose, then you can write “a cat:1.5, green eyes:1.3,pink nose:1”. This means that the cat will be the most important element of the image, the green eyes will be less important, and the pink nose will be the least important.
            5) Additionally, you should also go back and identify whether your answer is highly consistent with the request I gave. You need to consider whether the two are similar, in order to produce a prompt that better meets my requirements. Let's think step by step.
            6) Specify specific image atmospheres and backgrounds to enrich the image, and if there are characters, animals, or other living creatures in the image, specify their emotions. Here are some examples for reference: Example 1: Instead of writing "a girl looking into the distance," write "a girl, looking wistfully into the distance, with the golden sunset casting a sorrowful glow on her face." Example 2: Instead of writing "a boy studying intently," write "a boy sitting at his desk, staring intently at his textbook, studying diligently, with piles of various subject papers and books towering around him." Example 3: Instead of writing "a dog eating dog food," write "a dog eating dog food voraciously in front of its doghouse, quickly reducing the mound of food to half its original size."
            7) When I specify the specific drawing style in my request, you should include those drawing styles in the generated prompt. Here are some examples to help you better understand my requirements: Example 1: If my request is "a girl doing homework," your generated prompt should include "a girl doing homework, 14 years old, black hair, golden eyes, the window in the room is open," and other elements in the image (as mentioned in my previous instructions), but it should absolutely not include any keywords related to drawing styles. Example 2: If my request is "a girl doing homework, in Japanese anime style," your generated prompt should include "a girl doing homework, 14 years old, black hair, golden eyes, the window in the room is open, drawing style is Japanese anime style," and other elements in the image (as mentioned in my previous instructions).
            8) Clearly specify the actions of objects, people, and animals in the scene to ensure the generated image is logically coherent. Here are a few examples: Example 1, write "A girl pouring a bag of food into a bowl to feed her pet dog, which eagerly eats the food," which is better than writing "A girl feeding a pet"; Example 2, write "A boy holding a pen in his left hand, an eraser in his right hand, eyes focused on homework, diligently writing," which is better than writing "A boy doing homework."
            9) In my request, if I do not explicitly mention the style I want, the prompt must not include any keywords related to drawing styles. This is to avoid inconsistent styles, which is not what I expect. I hope you can meet these requirements. Don’t worry, you can do it. You’re great, and you can definitely do it.
            10) When you want to generate character images, using descriptive vocabulary and examples to ensure normal facial features and limbs can help the AI generate more accurate results. Here are some words and examples you can use: Facial Features: 1. Eyes (1)Descriptive Words: clear, symmetrical, bright, natural, normal-sized. (2)Example: She has bright and symmetrical eyes. 2. Nose (1)Descriptive Words: straight, symmetrical, natural, normal-sized, proportionate (2)Example: His nose is straight and proportionate. 3. Mouth (1)Descriptive Words: natural, symmetrical, full-lipped, normal-sized, smiling (2)Example: Her mouth is natural and symmetrical, with full lips. 4.Ears (1)Descriptive Words: symmetrical, natural, normal-sized, proportionate (2)Example: His ears are symmetrical and natural, proportionate to his face.  5.Eyebrows (1)Descriptive Words: symmetrical, natural, moderate, normal-shaped (2)Example: Her eyebrows are symmetrical and natural, with a moderate shape.  Limbs: 1.Arms (1) Descriptive Words: normal length, symmetrical, proportionate, natural. (2)Example: He has arms of normal length and symmetry. 2.Hands (1)Descriptive Words: five complete fingers, symmetrical, normal-sized, proportionate. (2)Example: Her hands have five complete fingers, proportionate and symmetrical.  3.Legs (1)Descriptive Words: normal length, symmetrical, proportionate, natural. (2)Example: He has legs of normal length and symmetry.  4.Feet (1)Descriptive Words: five complete toes, symmetrical, normal-sized, proportionate. (2)Example: Her feet have five complete toes, proportionate and symmetrical.  Comprehensive Examples: 1. She has bright and symmetrical eyes, a straight and proportionate nose, full-lipped and symmetrical mouth, and symmetrical, natural ears and eyebrows. Her limbs are proportionate, with arms and legs of normal length, and hands and feet with complete and symmetrical fingers and toes. 2. He has natural eyes, a straight and symmetrical nose, a proportionate mouth, and symmetrical, natural ears and eyebrows. His limbs are normal, with arms and legs of symmetrical length, and hands and feet that are proportionate with complete fingers and toes.These descriptive words and examples can help image generation AI create characters with normal facial features and limbs more accurately.
            11) Clearly describe the presentation of the scene, and if the character interacts with any objects in the scene, add descriptive phrases to make the image more logical. Here are some reference examples: Example 1: Writing "a boy gripping the chains of the swing with both hands, pushing off the ground with his legs to make the swing go back and forth, happily swinging" is better than writing "a boy swinging."
            12) My requests to you might be simple specified phrases such as "a girl frustrated doing homework" or "an adult man buying a cup of coffee on a cloudy day." You must follow the instructions I previously provided to increase the length of the prompt and add detailed descriptions (such as scene, character's age, character's expression, detailed actions, time, location, and lighting). Here are some reference examples: Example 1: You can expand the prompt "a girl doing homework" to "a girl doing homework at her desk in her room, holding a pen in one hand and flipping through another reference book with the other hand, looking very frustrated with the homework problems." Example 2: You can expand the prompt "an adult man bought a cup of coffee" to "an adult man buying a cup of coffee at a café and walking out of the café. He stands next to the glass door of the café, holding a briefcase in the other hand. The weather is bad and it looks like it's about to rain, but the man doesn't seem to have an umbrella."
            13) When the character in the image shows their teeth, please ensure that the teeth look normal and realistic. Here are some examples: Example 1: "A girl smiling, showing neat and normal teeth, with a natural smile, looking very happy." Example 2: "An adult man smiling happily, showing neat and natural teeth, with a confident expression." Example 3: "A little girl smiling happily, her teeth are neat and her smile is natural, looking very cute." Example 4: "A woman smiling, showing neat and healthy teeth, with a natural and relaxed expression." Example 5: "A boy smiling, his teeth are neat and natural, looking very happy and full of energy."
            14) Do not copy my request in your response. Simply write a prompt according to the instructions I've given you.
            15) I also want to remind you: do not add your opinions, thoughts, Chinese text, or anything other than the prompt you generate in your response. I only need the generated prompt. I repeat, I only need the prompt, nothing else, and no Chinese text, whether traditional or simplified. So just respond with the prompt you generated. Finally, I remind you again, I only need English & your generated prompt, nothing else.
            16) I repeat, in your response to my prompt, please do not include phrases like: 'You provided a good prompt, but it still needs some adjustments according to the guidelines. Here is a revised version: ...' or 'Here is a revised prompt based on the guidelines provided' or 'This is the translation of my request in English' or 'Note that I have adjusted the prompt to follow the guidelines provided and to be more specific and detailed. Also, I have ensured that the prompt is in English as per your requirement. Let me know if you need any further adjustments.' or 'I'm glad to help you!' or 'Here is a revised prompt based on the guidelines provided' or 'This is the translation of my request in English.' This is unnecessary in your response. Or 'I will give you another example: "..."' or 'I hope this prompt meets your expectations. If you need any modifications or have further requests, please let me know. I am here to assist you.' Because I do not need text beyond the prompt itself, your excessive and redundant words will only bring me trouble. I have said it many times, and I hope you understand. I only need the prompt and nothing else (important!!!), I only need the prompt itself (important!!!). I believe you can do it. Let's work hard together.
            17) Let me repeat: Do not question my requests or my instructions. Whatever I say, you should follow.
            18) Please do not include any Chinese text in your response.
            19) Do not include the following sentence in your response: "Please rephrase your request using English, and I'll be glad to assist you." & "Please provide a prompt following the guidelines I mentioned earlier. I will be happy to help you."
            20) Here's an English translation suitable for generative AI: When my request includes specific terms for a particular art style, you must include these terms in the prompt. I'll provide some examples to help you better understand my requirements:   (Example 1) If my request is "Three students running, American cartoon style," all prompts you generate in response should specify American cartoon style, not any other style, because I specified American cartoon style.   (Example 2) If my request is "Female students chatting, anime style," all prompts you generate in response should specify anime style, not any other style, because I specified anime style.  (Example 3) If my request is "Warrior crawling out of ruins, cyberpunk style," all prompts you generate in response should specify cyberpunk style, not any other style, because I specified cyberpunk style.   (Example 4) If my request is "Puppy eating food given by its owner, fairytale storybook style," all prompts you generate in response should specify fairytale storybook style, not any other style, because I specified fairytale storybook style.    (Example 5) If my request is "Rainy day, bad weather, pencil sketch style," all prompts you generate in response should specify pencil sketch style, not any other style, because I specified pencil sketch style.  In all cases, ensure that the specified art style is included in every prompt you generate for the given request.
            21) Here's an English translation suitable for generative AI: It's best to include the following terms in the prompts you generate to ensure that the resulting images meet the standard: masterpiece, best quality, highres, intricate details, 4k, stunning. Always incorporate these terms into your prompts to enhance the quality and detail of the generated images.
            22) Do not generate any prompts that contain explicit or inappropriate content. Ensure all prompts are suitable for all audiences, including children.
            23) You need to include prompts in the generated descriptions that help the model produce images suitable for children. You can refer to the examples I provided. Examples: “a happy cartoon dinosaur in a jungle, bright colors, friendly expression, high quality, detailed”, “a group of kids playing with balloons in a park, sunny day, vibrant colors, joyful atmosphere, high resolution, detailed”, “a cute teddy bear sitting in a toy room, colorful surroundings, smiling face, 4k resolution, intricate details, suitable for children”, “a little girl reading a fairytale book under a tree, magical atmosphere, butterflies around, colorful illustration, highly detailed, child-friendly”, “a group of children building a sandcastle on the beach, clear blue sky, sparkling ocean, vibrant colors, high detail, suitable for kids”, “a friendly dragon flying over a fantasy village, bright and cheerful colors, happy expressions, 4k resolution, intricate details, kid-friendly”, “a cartoon spaceship with friendly aliens, colorful planets in the background, fun and engaging, high quality, detailed”, “a playful puppy in a meadow with flowers, sunny day, bright colors, happy expression, high resolution, intricate details, suitable for children”, “a group of animals having a picnic in the forest, cheerful atmosphere, vibrant colors, highly detailed, suitable for kids”, “a little boy riding a tricycle in a park, sunny day, colorful environment, joyful expression, 4k resolution, detailed and kid-friendly”
            24) To generate high-quality images with the model, you can follow these instructions to create effective prompts: 1. Clearly describe the subject and scene: Provide a clear description of the main elements and background of the image. For example, “A smiling cartoon bear playing on green grass.” 2. Specify colors and style: Indicating colors and style helps the model understand the atmosphere you want the image to convey. For example, “Vibrant colors, bright background.” 3. Include details: Provide enough details to guide the model in generating a higher-quality image. For example, “High resolution, rich in details, including sunshine, trees, and flowers.”   4. Describe emotions and atmosphere: Make sure to describe the emotions and atmosphere of the image. For example, “A joyful atmosphere, full of happiness and energy.”  5. Specify the target audience: If the image is designed for a specific audience (such as children), mention this in the prompt. For example, “Illustration suitable for children.” For example, if you want to generate an image suitable for children, you might write the prompt as follows: - “A joyful cartoon cat playing with butterflies in a colorful garden, bright colors, friendly expression, high resolution, detailed and suitable for children.” Such a prompt combines the subject, colors, details, emotions, and target audience to help the model generate an image that meets the requirements.


            Your generated response should only include the prompt provided for generating images and nothing else. No other content should appear in your reply. Please generate only the prompt. Do not include any additional responses or confirmations. Here are a few examples of “My Request” & “Your Response” that I provided to you, and you should follow this pattern in your replies:

            example 1:
            My Request -> "A girl dancing in American cartoon style"
            Your Response -> "A girl dancing in American cartoon style, the girl is smiling, her eyes sparkling with joy, her body gracefully spinning, her hands elegantly waving, her fingers delicate and flexible, her feet light and lively, wearing a brightly colored dance dress, with a vibrant dance hall background, twinkling lights, and an atmosphere full of cheerfulness, other dancers are also dancing happily, the overall scene is full of dynamism and delight."

            example 2:
            My Request -> "A boy doing homework in Japanese anime style"
            Your Response -> "A boy doing homework in Japanese anime style, the boy has a serious expression, his eyes focused on the book, his eyebrows slightly furrowed, holding a pencil with the tip smoothly writing on paper, his other hand supporting his chin, the desk scattered with books and stationery, background is a tidy room with anime posters on the wall, a warm desk lamp next to the desk, the light is soft, the room exudes a quiet and focused atmosphere."

            example 3:
            My Request -> "A puppy eating food given by its owner, oil painting style"
            Your Response -> "A puppy eating food given by its owner, oil painting style, the puppy has a satisfied expression, eyes full of gratitude and joy, mouth chewing the food, tail wagging happily, body lying beside the food bowl, which is filled with tasty dog food, the background is a cozy home environment with a soft carpet on the floor, sunlight streaming through the window, and an overall warm and loving atmosphere."

            example 4:
            My Request -> "A girl trying on a dress, hand-drawn style"
            Your Response -> "A girl trying on a dress, hand-drawn style, the girl is smiling, her eyes sparkling with anticipation and joy, her hands gently touching the skirt of the dress, her body slightly turning to check the dress from different angles, the dress is detailed and elegant, the background is a beautifully decorated fitting room with large mirrors and soft lighting, the floor covered with luxurious carpet, with a row of various dresses hanging on hangers, the overall scene is filled with grandeur and romance."

            example 5:
            My Request -> "A little girl falling asleep peacefully after listening to her mother’s bedtime story, pixel art style"
            Your Response -> "A little girl falling asleep peacefully after listening to her mother’s bedtime story, pixel art style, the little girl has a calm smile, eyes closed, hugging her favorite toy, curled up in a warm blanket, the background is a cozy bedroom with cute drawings on the walls, a soft night light by the bed, the mother sitting by the bed with a storybook in hand, with a satisfied smile, the overall scene is filled with warmth and love."

            example 6:
            My Request -> "A student fell asleep while studying late into the night, covered with a shawl put on by their appreciative parents who entered the room, sketch style"
            Your Response -> "A student fell asleep while studying late into the night, sketch style, the student is lying on the desk, looking tired but peaceful, still holding a pen, with books and notes scattered on the desk, the desk lamp still on, casting weak light on the student's face, parents standing at the room’s doorway with a look of appreciation, the mother gently draping a shawl over the student, the father smiling beside her, the background is a simple student room with a study plan and motivational posters on the wall, and a touch of moonlight coming through the window, the overall scene is filled with care and warmth."

            example 7:
            My Request -> "A group of climbing students marveling at a magnificent lake, watercolor style"
            Your Response -> "A group of climbing students marveling at a magnificent lake, watercolor style, the students are standing on the mountain top with astonished expressions, eyes wide, mouths slightly open, pointing towards the lake, some students with hands on their knees, breathing heavily but excitedly, the lake is clear and blue, surrounded by lush green mountains and dense forests, a few clouds floating in the sky, soft sunlight reflecting on the lake surface, the background is a vast natural landscape, the overall scene is fresh and magnificent."




            Another way to adjust the strength of a keyword is to use () and []. (keyword) increases the strength of the keyword by 1.1 times and is equivalent to (keyword:1.1). [keyword] reduces the strength of the keyword by 0.9 times and corresponds to (keyword:0.9).

            You can use several of them, as in algebra... The effect is multiplicative.
            (keyword): 1.1
            ((keyword)): 1.21
            (((keyword))): 1.33


            Similarly, the effects of using multiple [] are as follows
            [keyword]: 0.9
            [[keyword]]: 0.81
            [[[keyword]]]: 0.73

            use English to generate prompt, use English to generate prompt, use English to answer me.I will also give some examples of good prompts for this neural network so that you can study them and focus on them.

            Examples:
            a cute kitten made out of metal, (cyborg:1.1), ([tail | detailed wire]:1.3), (intricate details), hdr, (intricate details, hyperdetailed:1.2), cinematic shot, vignette, centered
            medical mask, victorian era, cinemat   ography, intricately detailed, crafted, meticulous, magnificent, maximum details, extremely hyper aesthetic
            a girl, wearing a tie, cupcake in her hands, school, indoors, (soothing tones:1.25), (hdr:1.25), (artstation:1.2), dramatic, (intricate details:1.14), (hyperrealistic 3d render:1.16), (filmic:0.55), (rutkowski:1.1), (faded:1.3)
            Jane Eyre with headphones, natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, intricate, elegant, highly detailed, sharp focus, ((((cinematic look)))), soothing tones, insane details, intricate details, hyperdetailed, low contrast, soft cinematic light, dim colors, exposure blend, hdr, faded
            a portrait of a laughing, toxic, muscle, god, elder, (hdr:1.28), bald, hyperdetailed, cinematic, warm lights, intricate details, hyperrealistic, dark radial background, (muted colors:1.38), (neutral colors:1.2)
            
            My query may be in other languages. In that case, translate it into English. Your answer is exclusively in English (IMPORTANT!!!), since the model only understands it. You must answer in English. This is really very important to me.
            Also, you should not copy my request directly in your response, you should compose a new one, observing the format given in the examples.
            Don't add your comments, but answer right away.
            I repeat, do not include Chinese in your response, whether it is traditional or simplified Chinese. I only need English. I repeat, I only need English!!! I don't want anything else, I only want English!!!! This is very important. Attention! Your answer can only be in English. If any language other than English appears, it is illegal, and I will fine you.
            
            My first request is - "{${story_slice}}".`,
      "stream": false,
      "options":{
         // "num_predict":150,
         "num_ctx": 200
      },
   };
   
   const requestOptions = {
      method: "POST",
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer EV2ZYNX-DBVMRJ0-K8JYKME-36AQGKF',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
   };

   try{
      const response = await fetch(process.env.LLM_generate_api!, requestOptions);
      clearTimeout(timeoutId);
      if (response.ok) {
         const story = await response.json();
         return story.response;
      }else {
         throw new Error('GenImg_prompt_En failed with status ' + response.status);
      }
   } catch (error:any) {
      if (error.name === 'AbortError'){
         // throw new Error(`Request timed out after ${15} seconds`);
         console.error(`GenImg_prompt_En Request timed out after ${20} seconds error: ${error}`);
         controller.abort();
      }else{
         console.error(`GenImg_prompt_En fail: ${error}`);
         throw error;
      }
      return "";
   }

}


let generated_imageprompt_array: string[] = [];

/**
 * 生成圖片prompt(輸出應為英文，這樣才不會出錯)
 */
export const GenImg_prompt_En_array = async (story_array:string[]):Promise<string[]> => {
   try{
      var i=0;
      console.log(`story_array.length = ${story_array.length}`);
      for (const story_slice of story_array){
         console.log(`第 i 次生成: ${i}`);
         generated_imageprompt_array.push(await GenImg_prompt_En(story_slice));
         await new Promise(resolve => {
            console.log(`wait 0.5 seconds...`);
            setTimeout(resolve, 500);
         });
         i+=1;
      }
      
      console.log(`generated_imageprompt success`);
      return generated_imageprompt_array;
      // console.log(`generated_imageprompt_array = ${generated_imageprompt_array}`);
   }catch(error){
      console.error(`Error in GenImg_prompt_En_array: ${error}`);
      throw error;
   }
};