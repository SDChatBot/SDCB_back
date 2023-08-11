import fs from 'fs';

//Buffer是 Node.js中將字符串轉成二進制的方法
const Base64_To_Image = async(Base64Code:string) =>{
    const bufferData = Buffer.from(Base64Code, 'base64');
    // 將圖片寫入本地文件
    //fs.writeFileSync('D:/NewCodeFile/SDCB/GitHub_SDCB/SDCB_back/src/images/image.png', bufferData); 
}

export default Base64_To_Image; 