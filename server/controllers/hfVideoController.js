//videos created directly with ffmpeg

const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');
ffmpeg.setFfmpegPath(pathToFfmpeg)

const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();


const generateVideo = async (req, res) => {
    const { prompts } = req.body;

    const imagePaths = prompts.map((_, index) => path.join(__dirname, '..', 'output', `image${index}.png`));
    const videoPath = path.join(__dirname, '..', 'output', 'video.mp4');
    try {
        // Generate video from images

        const ffmpegCommand = ffmpeg();

        imagePaths.forEach((imagePath, index) => {
            ffmpegCommand.input(imagePath);
        });

        const filterComplex = imagePaths.map((_, index) => {
            return `[${index}:v]loop=loop=150:size=1,trim=duration=5,setsar=1[v${index}]`;
        }).join('; ') + `; ${imagePaths.map((_, index) => `[v${index}]`).join(' ')}concat=n=${imagePaths.length}:v=1:a=0[outv]`;


        ffmpegCommand
            .complexFilter(filterComplex, ['outv'])
            .outputOptions('-c:v', 'libx264', '-r', '25', '-pix_fmt', 'yuv420p')
            .on('start', (commandLine) => {
                console.log(`FFmpeg command: ${commandLine}`)
            })
            .on('end', () => {
                console.log(`Video successfully generated at ${videoPath}`); // Debugging statement
                // res.json({ videoUrl: `/output/video.mp4` });

                fs.access(videoPath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('Video file does not exist:', videoPath);
                        res.status(500).json({ error: 'Video file not found' });
                    } else {
                        const videoUrl = `/output/video.mp4`;
                        console.log(`Video URL to send to frontend: ${videoUrl}`);
                        res.json({ videoUrl }); //??
                    }
                })
            })
            .on('error', (err) => {
                console.error('Error generating video:', err); // Debugging statement
                res.status(500).json({ error: err.message });

            })
            .save(videoPath);
    } catch (error) {
        console.error('Error in generateVideo:', error); // Debugging statement
        res.status(500).json({ error: error.message });
    }
};

module.exports = { generateVideo };

