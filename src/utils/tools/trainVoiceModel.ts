import { spawn } from 'child_process'; // child_processDo
import dotenv from 'dotenv';
dotenv.config();

// command 1 (Audio slicer)
export const trainVoiceModel = async(modelName: string) => {
    const audioDir: string = `${process.env.dev_saveRecording!}/${modelName}.wav`
    
    // audioDir  is 錄音檔所在目錄
    // modelName is 模型名稱
    //! 如果我要很頻繁的使用conda 環境，那我先測試能不能先在conda 環境中啟動後端
    //! 如果要使用程式碼的話錯參考testaa.txt
    return new Promise((resolve, reject) => {
        const slicerDir = `output/slicer_opt/${modelName}`; 
        const command = '/home/b310-21/miniconda3/envs/GPTSoVits/bin/python';
        const arg = [
            'tools/slice_audio.py',
            audioDir, 
            slicerDir,
            // ! 這邊要確定一下，原本的gpt-sovits 中是使用了四次的指令
            '-34', '4000',  '300',  '10',  '500',  '0.9',  '0.25',  '0',  '1'
        ];

        const processDo = spawn(command, arg, {
            shell: true,
            cwd: process.env.gptsovits_dir_path! // 指定目錄
        });

        processDo.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        processDo.stderr.on('data', (data) => {
            console.log(`stderr: ${data.toString()}`);
        });

        // 監控子進程結束
        processDo.on('close', (code) => {
            if(code === 0){
                console.log(`Child process exited with code ${code}`);
                resolve('Command executed successfully');
            }else{
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
};


// command 2 (語音降噪)
export const Denosie = async(modelName: string) => {
    // slicerDir is "output/slicer_opt/模型名稱"
    // denoiseDir is "output/denoise_opt/模型名稱"
    return new Promise((resolve, reject) => {
        const slicerDir = `/home/b310-21/projects/GPT-SoVITS/output/slicer_opt/${modelName}`;
        const denoiseDir = `/home/b310-21/projects/GPT-SoVITS/output/denoise_opt/${modelName}`;
        // ! 這邊加上 如果沒有此資料夾，則創建他（我覺得vits 中本來就有這個功能了
        const command = '/home/b310-21/miniconda3/envs/GPTSoVits/bin/python';
        const arg = [
            'tools/cmd-denoise.py',
            '-i', slicerDir,
            '-o', denoiseDir,
            '-p', 'float16'
        ];

        const processDo = spawn(command, arg, {
            shell: true,
            cwd: process.env.gptsovits_dir_path! // 指定目錄
        });

        processDo.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        processDo.stderr.on('data', (data) => {
            console.log('stderr: ${data.toString()}');
        });

        processDo.on('close', (code) => {
            if(code === 0){
                console.log(`Child process exited with code ${code}`);
                resolve('Command executed successfully');
            }else{
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
};

// command 3 (ASR)
export const Asr = async(modelName: string) => {
    // denoiseDir is "/home/b310-21/projects/GPT-SoVITS/output/denoise_opt/模型名稱"
    // asrDir is "output/asr_opt/模型名稱"
    return new Promise((resolve, reject) => {
        const denoiseDir = `/home/b310-21/projects/GPT-SoVITS/output/denoise_opt/${modelName}`;
        const asrDir = `/home/b310-21/projects/GPT-SoVITS/output/asr_opt/${modelName}`;

        const command = '/home/b310-21/miniconda3/envs/GPTSoVits/bin/python';
        const arg = [
            'tools/asr/funasr_asr.py',
            '-i', denoiseDir,
            '-o', asrDir,
            '-s', 'large', '-l', 'zh', '-p', 'float16'
        ];

        const processDo = spawn(command, arg, {
            shell: true,
            cwd: process.env.gptsovits_dir_path! // 指定目錄
        });

        processDo.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        processDo.stderr.on('data', (data) => {
            console.log(`stderr: ${data.toString()}`);
        });

        processDo.on('close', (code) => {
            if(code === 0){
                console.log(`Child process exited with code ${code}`);
                resolve('Command executed successfully');
            }else{
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
};

// command 4 (一鍵三連):
export const OneClick = async(modelName: string) => {
    return new Promise((resolve, reject) => {
        // step 1: 設置環境變數
        const envir = {
            //! 為什麼要加入 process.env ？
            ...process.env,  // 繼承當前的環境變數
            inp_text: `/home/b310-21/projects/GPT-SoVITS/output/asr_opt/${modelName}/${modelName}.list` ,
            inp_wav_dir: `/home/b310-21/projects/GPT-SoVITS/output/denoise_opt/${modelName}`,
            exp_name: `${modelName}`,
            i_part: "0",
            all_parts: "1",
            _CUDA_VISIBLE_DEVICES: "0",
            opt_dir:`/home/b310-21/projects/GPT-SoVITS/logs/${modelName}`,
            bert_pretrained_dir:"GPT_SoVITS/pretrained_models/chinese-roberta-wwm-ext-large",
            cnhubert_base_dir:"GPT_SoVITS/pretrained_models/chinese-hubert-base",
            pretrained_s2G:"GPT_SoVITS/pretrained_models/s2G488k.pth",
            s2config_path:"GPT_SoVITS/configs/s2.json",
            is_half:"True"
        };

        const option = {
            cwd: process.env.gptsovits_dir_path!,  // 子進程的當前目錄
            env: envir,                            // 環境變數
            //stdio: 'pipe'    // 使用父進程的stdout, stderr
        };

        // step 2: 執行一鍵三連的腳本
        // step 2-1: 執行 1-get-text.py
        const processDo1 = spawn('/home/b310-21/miniconda3/envs/GPTSoVits/bin/python', ['GPT_SoVITS/prepare_datasets/1-get-text.py'], option);

        processDo1.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        processDo1.stderr.on('data', (data) => {
            console.log(`stderr: ${data.toString()}`);
        });

        // 依序監控三個腳本的子進程結束
        processDo1.on('close', (code) => {
            if(code === 0){
                console.log(`1-get-text.py exited with code ${code}`);

                // step 2-2: 執行 2-get-hubert-wav32k.py
                const processDo2 = spawn('/home/b310-21/miniconda3/envs/GPTSoVits/bin/python', ['GPT_SoVITS/prepare_datasets/2-get-hubert-wav32k.py'], option);
                
                processDo2.on('close', (code) => {
                    if(code === 0){
                        console.log(`2-get-hubert-wav32k.py exited with code ${code}`);

                        // step 2-3: 執行 3-get-semantic.py
                        const processDo3 = spawn('/home/b310-21/miniconda3/envs/GPTSoVits/bin/python', ['GPT_SoVITS/prepare_datasets/3-get-semantic.py'], option);

                        processDo3.on('close', (code) => {
                            if(code === 0){
                                console.log(`3-get-semantic.py exited with code ${code}`);
                                resolve('All Command executed successfully');
                            }
                            else{
                                console.log(`3-get-semantic.py Command failed with code ${code}`);
                            }
                        })
                    }else{
                        reject(new Error(`2-get-hubert-wav32k.py Command failed with code ${code}`));
                    }
                });
            
            }else{
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
};





// command 5-1 (train):
export const SoVITS_train = async(modelName: string) => {
    return new Promise((resolve, reject) => {
        // cmd5 的 step 1:
        //config : 修改tmp_s2.json檔中的參數
        const config = `{"train": {"log_interval": 100, "eval_interval": 500, "seed": 1234, "epochs": 8, "learning_rate": 0.0001, "betas": [0.8, 0.99], "eps": 1e-09, "batch_size": 6, "fp16_run": true, "lr_decay": 0.999875, "segment_size": 20480, "init_lr_ratio": 1, "warmup_epochs": 0, "c_mel": 45, "c_kl": 1.0, "text_low_lr_rate": 0.4, "pretrained_s2G": "GPT_SoVITS/pretrained_models/s2G488k.pth", "pretrained_s2D": "GPT_SoVITS/pretrained_models/s2D488k.pth", "if_save_latest": true, "if_save_every_weights": true, "save_every_epoch": 4, "gpu_numbers": "0"}, "data": {"max_wav_value": 32768.0, "sampling_rate": 32000, "filter_length": 2048, "hop_length": 640, "win_length": 2048, "n_mel_channels": 128, "mel_fmin": 0.0, "mel_fmax": null, "add_blank": true, "n_speakers": 300, "cleaned_text": true, "exp_dir": "logs/test_55"}, "model": {"inter_channels": 192, "hidden_channels": 192, "filter_channels": 768, "n_heads": 2, "n_layers": 6, "kernel_size": 3, "p_dropout": 0.1, "resblock": "1", "resblock_kernel_sizes": [3, 7, 11], "resblock_dilation_sizes": [[1, 3, 5], [1, 3, 5], [1, 3, 5]], "upsample_rates": [10, 8, 2, 2, 2], "upsample_initial_channel": 512, "upsample_kernel_sizes": [16, 16, 8, 2, 2], "n_layers_q": 3, "use_spectral_norm": false, "gin_channels": 512, "semantic_frame_rate": "25hz", "freeze_quantizer": true}, "s2_ckpt_dir": "logs/${modelName}", "content_module": "cnhubert", "save_weight_dir": "SoVITS_weights", "name": "${modelName}"}` ; 
        const command = `cat << 'EOF' > /home/b310-21/projects/GPT-SoVITS/TEMP/tmp_s2.json\n${config}\nEOF`;

        const processDo = spawn('bash', ['-c', command], {       // -c : 指定要執行的指令
            shell: true,
            cwd: process.env.gptsovits_dir_path! // 指定目錄
        });

        processDo.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        processDo.stderr.on('data', (data) => {
            console.log(`stderr: ${data.toString()}`);
        });

        processDo.on('close', (code) => {
            if(code === 0){
                console.log(`Child process exited with code ${code}`);

                // cmd5 的 step 2:
                spawn('/home/b310-21/miniconda3/envs/GPTSoVits/bin/python',  ['GPT_SoVITS/s2_train.py', '--config', '/home/b310-21/projects/GPT-SoVITS/TEMP/tmp_s2.json'], {
                    shell: true,
                    cwd: process.env.gptsovits_dir_path!
                });

                resolve('Command executed successfully');
            }else{
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
};

export const GPT_train = async(modelName: string) => {
    return new Promise((resolve, reject) => {
        // cmd5 的 step 3:
        //config : 修改tmp_s1.yaml中的參數(output_dir, train_phoneme_path, train_semantic_path, exp_name)
        const config = `
        {
            data:
                max_eval_sample: 8
                max_sec: 54
                num_workers: 4
                pad_val: 1024
            inference:
                top_k: 5
            model:
                EOS: 1024
                dropout: 0
                embedding_dim: 512
                head: 16
                hidden_dim: 512
                linear_units: 2048
                n_layer: 24
                phoneme_vocab_size: 512
                random_bert: 0
                vocab_size: 1025
            optimizer:
                decay_steps: 40000
                lr: 0.01
                lr_end: 0.0001
                lr_init: 1.0e-05
                warmup_steps: 2000
            output_dir: logs/${modelName}/logs_s1
            pretrained_s1: GPT_SoVITS/pretrained_models/s1bert25hz-2kh-longer-epoch=68e-step=50232.ckpt
            train:
                batch_size: 6
                epochs: 15
                exp_name: ${modelName}
                gradient_clip: 1.0
                half_weights_save_dir: GPT_weights
                if_dpo: false
                if_save_every_weights: true
                if_save_latest: true
                precision: 16-mixed
                save_every_n_epoch: 5
                seed: 1234
            train_phoneme_path: logs/${modelName}/2-name2text-0.txt
            train_semantic_path: logs/${modelName}/6-name2semantic-0.tsv
        }
        `
        const command = `cat << 'EOF' > /home/b310-21/projects/GPT-SoVITS/TEMP/tmp_s1.yaml\n${config}\nEOF`;

        const processDo = spawn('bash', ['-c', command], {  // -c : 指定要執行的指令
            shell: true,
            cwd: process.env.gptsovits_dir_path! // 指定目錄
        });

        processDo.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        processDo.stderr.on('data', (data) => {
            console.log(`stderr: ${data.toString()}`);
        });

        processDo.on('close', (code) => {
            if(code === 0){
                console.log(`Child process exited with code ${code}`);

                // cmd5 的 step 4:
                spawn('/home/b310-21/miniconda3/envs/GPTSoVits/bin/python', ['GPT_SoVITS/s1_train.py', '--config_file', '/home/b310-21/projects/GPT-SoVITS/TEMP/tmp_s1.yaml'], {
                    shell: true,
                    cwd: process.env.gptsovits_dir_path!
                });

                resolve('Command executed successfully');
            }else{
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
};