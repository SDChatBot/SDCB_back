import axios from 'axios';
import { imagesInterface } from '../../interfaces/imagesInterface';

const url = "http://163.13.201.153:7860/"; //http://163.13.201.153:7860/sdapi/v1/txt2img
const payload = {
    prompt: "a big banana",
    steps: 1,
};
let imagesBase64:string[]
const fetchImage = async () => {
    try {
        const response = await axios.post<imagesInterface>(`${url}sdapi/v1/txt2img`, payload);
        console.log(response.data)
        imagesBase64 = response.data.images;
        //console.log(`imagesBase64 is : ${imagesBase64}`)
        return response.data.images
    } catch (error) {
        console.log(`Error fetchImage response is ${error}`)
        return `Error => no return `;
    }
};

export default fetchImage;