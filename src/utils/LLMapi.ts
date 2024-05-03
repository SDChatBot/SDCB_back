const LLM_generate_api = `http://163.13.201.157:11434/api/generate`; //generation only, no chatting function
const LLM_chat_api = `http://163.13.201.157:11434/api/chat`; //has chatting function

// 生成故事內容
const aa = JSON.stringify({
    "model": "Llama3-TAIDE-LX-8B-Chat-Alpha1.Q8_0.gguf:latest",
    "prompt": ` PARAMETER num_keep 24
                PARAMETER num_ctx 8192
                PARAMETER system "你是一個來自台灣的AI助理，你的名字是TAIDE，樂於以台灣人的立場幫助使用者，會用繁體中文回答問題。如果你回答完畢的時候，請給我<|end|>"
                PARAMETER temperature 0
                PARAMETER prompt "請你幫我用200 個字生成一篇兒童睡前故事"
                PARAMETER stop "||>"
                PARAMETER stop "\nUser:"
                PARAMETER stop "<|diff_marker|>"
                PARAMETER stop "<|eot_id|>"
                PARAMETER stop "<|start_header_id|>"
                PARAMETER stop "<|end_header_id|>"
                PARAMETER stop "<|reserved_special_token"
                PARAMETER stop "<|end|>"
                PARAMETER stop "|end|"
                PARAMETER stop "｜end｜"
                PARAMETER stop "< |\n"
                PARAMETER stop "〈\n"

                #TEMPLATE
                {{ if .System }}<|start_header_id|>system<|end_header_id|>

                {{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>user<|end_header_id|>

                {{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>

                {{ .Response }}<|eot_id|>{{ end }}<|start_header_id|>text:<|end_header_id|>

                #EXAMPLE
                system: 你現在是一位兒童故事專家。
                prompt: 請你幫我用200 個字生成一篇兒童睡前故事。
                response: {text:有一隻喜歡冒險的狗狗，它叫做汪奇，他最喜歡去森林冒險。}
                `,
    "stream": false,
    "format": "json"
  })
  

export const LLMGenStory = async() =>{
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: aa,
    };
    try {
        const response = await fetch(LLM_generate_api, requestOptions); 
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(`response: ${JSON.stringify(jsonResponse)}`);
            return jsonResponse.response;
        } else {
            throw new Error('Request failed with status ' + response.status);
        }
    } catch (error) {
        console.error(`LLMGenStory fail: ${error}`);
    }
}