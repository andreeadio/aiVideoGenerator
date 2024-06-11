// const axios = require('axios');
// const ffmpeg = require('fluent-ffmpeg');
// const pathToFfmpeg = require('ffmpeg-static');
// ffmpeg.setFfmpegPath(pathToFfmpeg)

// const path = require('path');
// const fs = require('fs-extra');
// require('dotenv').config();


// //const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
// //"https://api-inference.huggingface.co/models/Corcelio/mobius"
// const HF_API_URL = "https://api-inference.huggingface.co/models/fluently/Fluently-XL-Final"


// const HF_API_KEY = process.env.HF_API_KEY;


// const generateVideo = async (req, res) => {
//     const { prompts } = req.body;
//     const imagePaths = [];

//     try {
//         // Ensure the output directory exists
//         const outputDir = path.join(__dirname, '..', 'output');
//         await fs.ensureDir(outputDir);

//         // Generate images from prompts
//         for (let i = 0; i < prompts.length; i++) {
//             const prompt = prompts[i];
//             console.log(`Generating image for prompt ${i}: ${prompt}`); // Debugging statement

//             const response = await axios.post(HF_API_URL, {
//                 inputs: prompt
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${HF_API_KEY}`,
//                     'Content-Type': 'application/json'
//                 },
//                 responseType: 'arraybuffer'
//             });

//             if (response.status !== 200) {
//                 console.error(`Error from API for prompt ${i}:`, response.data); // Debugging statement
//                 return res.status(response.status).json({ error: 'Error generating image from API' });
//             }

//             const buffer = Buffer.from(response.data, 'binary');
//             const imagePath = path.join(outputDir, `image${i}.png`);
//             await fs.writeFile(imagePath, buffer);
//             imagePaths.push(imagePath);
//             console.log(`Image saved at ${imagePath}`); // Debugging statement
//         }

//         // Generate video from images
//         const videoPath = path.join(outputDir, 'video.mp4');
//         const ffmpegCommand = ffmpeg();


//         imagePaths.forEach((imagePath, index) => {
//             ffmpegCommand.input(imagePath);
//         });

//         const filterComplex = imagePaths.map((_, index) => {
//             return `[${index}:v]loop=loop=150:size=1,trim=duration=5,setsar=1[v${index}]`;
//         }).join('; ') + `; ${imagePaths.map((_, index) => `[v${index}]`).join(' ')}concat=n=${imagePaths.length}:v=1:a=0[outv]`;


//         ffmpegCommand
//             .complexFilter(filterComplex, ['outv'])
//             .outputOptions('-c:v', 'libx264', '-r', '25', '-pix_fmt', 'yuv420p')
//             .on('start', (commandLine) => {
//                 console.log(`FFmpeg command: ${commandLine}`)
//             })
//             .on('end', () => {
//                 console.log(`Video successfully generated at ${videoPath}`); // Debugging statement
//                 // res.json({ videoUrl: `/output/video.mp4` });

//                 fs.access(videoPath, fs.constants.F_OK, (err) => {
//                     if (err) {
//                         console.error('Video file does not exist:', videoPath);
//                         res.status(500).json({ error: 'Video file not found' });
//                     } else {
//                         const videoUrl = `/output/video.mp4`;
//                         console.log(`Video URL to send to frontend: ${videoUrl}`);
//                         res.json({ videoUrl });
//                     }
//                 })
//             })
//             .on('error', (err) => {
//                 console.error('Error generating video:', err); // Debugging statement
//                 //res.status(500).json({ error: err.message });

//             })
//             .save(videoPath);
//     } catch (error) {
//         console.error('Error in generateVideo:', error); // Debugging statement
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = { generateVideo };

