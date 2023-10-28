"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveBase64Image = void 0;
function saveBase64Image(base64string, filename) {
    console.log(`typeof base64string = ${base64string}`);
    const buffer = Buffer.from(base64string.split(',')[1], 'base64');
    // const filePath = path.join(__dirname, 'assets', filename);
    // fs.writeFile(filePath, buffer, (error) => {
    //    if (error) {
    //       console.error(`Error saving image: ${error}`);
    //    } else {
    //       console.log(`${filePath} saved successfully.`);
    //    }
    // });
}
exports.saveBase64Image = saveBase64Image;
// saveBase64Image(imageBase64, 'myImage.png');
