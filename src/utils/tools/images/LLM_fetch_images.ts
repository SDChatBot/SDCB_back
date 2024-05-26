/**
 * http://163.13.201.153:3001/api/docs
 * Anything LLM api url
 */
const LLM_generate_api = `http://163.13.201.153:3001/api/v1/workspace/whispertales/chat`; //generation only, no chatting function


/**
 * POST
 * 生成圖片prompt(英文，第一次，第二次，皆用這個)
 */
export const GenImg_prompt_1st_2nd = (payload: Object): Promise<string> => {
   return new Promise((resolve, reject)=>{
      const requestOptions = {
         method: "POST",
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer EV2ZYNX-DBVMRJ0-K8JYKME-36AQGKF'
         },
         body: JSON.stringify(payload)
      };

      fetch(LLM_generate_api, requestOptions)
         .then(response => {
            if (response.ok) {
               return response.json();
            } else {
               throw new Error('Request failed with status ' + response.status);
            }
         })
         .then(LLM_Ans => {
            // console.log(`GenImg_prompt_1st_2nd response: ${JSON.stringify(LLM_Ans)}`);
            const str_LLM_Ans: string = JSON.stringify(LLM_Ans.textResponse)
            resolve(str_LLM_Ans); // Resolve the promise with the response
         })
         .catch(error => {
            console.error(`GenImg_prompt_1st_2nd fail: ${error}`);
            reject(error); // Reject the promise with the error
         });
   }) 
};