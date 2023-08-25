const translator = require('node-google-translate-skidz');

//中文轉英文

export async function TranslateEn(originalString: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        translator(
            {
                text: originalString,
                source: 'zh',
                target: 'en'
            },
            (result: { translation: string }) => {
                //console.log(`result.translation = ${result.translation}`);
                resolve(result.translation);
            }
        );
    });
}

//英文轉中文
export function TranslateZh(originalString: string) {
    translator({
        text: originalString,
        source: 'en', 
        target: 'zh'
    }, (result: string) => {
        return result;
    })
}