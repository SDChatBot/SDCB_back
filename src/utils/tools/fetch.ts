import axios from 'axios';
import { imagesInterface } from '../../interfaces/imagesInterface';
import Base64_To_Image from './DecodeBase64';

const url = "http://163.13.201.153:7860/"; //http://163.13.201.153:7860/sdapi/v1/txt2img
const payload = {
    prompt:"a cut cat",
    seed:-1,
    cfg_scale:7,
    step:1,
};
let imagesBase64:string[]
const fetchImage = async () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    try {
        const response = await fetch(`${url}sdapi/v1/txt2img`, requestOptions);
        const data = await response.json();
        imagesBase64 = data.images;
        Base64_To_Image(data.images);
        return data.images;
    } catch (error) {
        console.log(`Error fetchImage response is ${error}`);
        return `Error => no return `;
    }
};

export default fetchImage;