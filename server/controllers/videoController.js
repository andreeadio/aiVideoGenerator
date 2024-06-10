// const axios = require('axios')
// const ffmpeg = require('fluent-ffmpeg')


// const pathToFfmpeg = require('ffmpeg-static'); // This will automatically point to the correct path if installed via npm

// ffmpeg.setFfmpegPath(pathToFfmpeg);
// const path = require('path')
// require('dotenv').config

// IMAGE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
// const generateVideo = async (req, res) => {
//     const { prompts } = req.body
//     const images = []

//     try {
//         for (const prompt of prompts) {
//             const response = await axios.post(IMAGE_API_URL, { prompt }, {
//                 headers: { 'Authorization': `Bearer ${IMAGE_API_KEY}` }
//             });
//             images.push(response.data.imageUrl); // Assuming the API returns an image URL
//         }

//         const videoPath = path.join(__dirname, '..', 'output', 'video.mp4');
//         const ffmpegCommand = ffmpeg();

//         images.forEach((image) => {
//             ffmpegCommand.input(image);
//         });

//         ffmpegCommand
//             .on('end', () => res.json({ videoUrl: `/output/video.mp4` }))
//             .on('error', (err) => res.status(500).json({ error: err.message }))
//             .save(videoPath);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// module.exports = { generateVideo };