import *  as sdk from "microsoft-cognitiveservices-speech-sdk"
import { PassThrough } from 'stream';

export const textToSpeech = async (key: string, region: string, text: string, CHAR: string): Promise<string | string> => {

   return new Promise((resolve, reject) => {
      console.log(key)
      const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
      speechConfig.speechSynthesisOutputFormat = 5; // mp3
      // speechConfig.speechSynthesisVoiceName = "zh-CN-YunhaoNeural"; 
      // speechConfig.speechSynthesisVoiceName = "zh-CN-YunxiNeural"; 
      speechConfig.speechSynthesisVoiceName = CHAR;
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

      synthesizer.speakTextAsync(
         text,
         result => {
            const { audioData } = result;
            synthesizer.close();
            const bufferStream = new PassThrough();
            bufferStream.end(Buffer.from(audioData));
            const chunks: Array<Buffer> = [];
            bufferStream.on('data', (chunk) => {
               chunks.push(chunk);
            });
            bufferStream.on('end', () => {
               const buffer = Buffer.concat(chunks);
               const base64Data = buffer.toString('base64');
               resolve(base64Data);
            });
         },
         error => {
            synthesizer.close();
            reject(error);
         });
   });
}