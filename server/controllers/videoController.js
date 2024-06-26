const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');
ffmpeg.setFfmpegPath(pathToFfmpeg);

const path = require('path');
const fs = require('fs-extra');
const videoshow = require('videoshow');
const Image = require('../models/Image');
const Audio = require('../models/Audio'); // Import the Audio model
const Video = require('../models/Video');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const generateVideo = async (req, res) => {
    const { prompts: rawPrompts, duration, audioId } = req.body; // Add audioId to the request body

    // Parse prompts JSON
    let prompts;
    try {
        prompts = JSON.parse(rawPrompts);
    } catch (error) {
        return res.status(400).json({ error: 'Invalid prompts format' });
    }

    const userId = req.user.userId;
    const outputDir = path.join(__dirname, '..', 'output');
    const videoPath = path.join(outputDir, `video-${uuidv4()}.mp4`);
    const tempImages = [];

    try {
        await fs.ensureDir(outputDir);

        console.log('Prompts:', prompts);
        console.log('User ID:', userId);

        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];
            const imageRecord = await Image.findOne({ prompt, userId });

            if (!imageRecord) {
                console.error(`Image not found in database for prompt: ${prompt}`);
                throw new Error(`Image not found in database for prompt: ${prompt}`);
            }

            console.log(`Found image for prompt: ${prompt}`);

            const base64Data = imageRecord.imageData.replace(/^data:image\/png;base64,/, '');
            const imagePath = path.join(outputDir, `temp-image-${uuidv4()}.png`);
            await fs.writeFile(imagePath, base64Data, 'base64');
            tempImages.push(imagePath);
        }

        const images = tempImages.map((imagePath) => ({
            path: imagePath,
        }));

        const videoOptions = {
            fps: 25,
            loop: duration,
            transition: true,
            transitionDuration: 1,
            videoBitrate: 1024,
            videoCodec: 'libx264',
            size: '1280x?',
            audioBitrate: '128k',
            audioChannels: 2,
            format: 'mp4',
            pixelFormat: 'yuv420p',
        };

        const videoBuilder = videoshow(images, videoOptions);

        if (audioId) {
            const audioRecord = await Audio.findById(audioId);

            if (!audioRecord) {
                console.error('Audio file not found in database');
                throw new Error('Audio file not found in database');
            }

            const audioFilePath = path.join(outputDir, `temp-audio-${uuidv4()}.mp3`);
            await fs.writeFile(audioFilePath, audioRecord.data);

            videoBuilder.audio(audioFilePath);
        }

        videoBuilder
            .save(videoPath)
            .on('start', (command) => {
                console.log('ffmpeg process started:', command);
            })
            .on('error', async (err, stdout, stderr) => {
                console.error('Error:', err);
                console.error('ffmpeg stderr:', stderr);
                for (const imagePath of tempImages) {
                    await fs.remove(imagePath);
                }
                res.status(500).send('Error generating video');
            })
            .on('end', async (output) => {
                console.log('Video created in:', output);
                for (const imagePath of tempImages) {
                    await fs.remove(imagePath);
                }
                if (audioId) {
                    const audioFilePath = path.join(outputDir, `temp-audio-${uuidv4()}.mp3`);
                    await fs.remove(audioFilePath);
                }

                const video = new Video({
                    videoUrl: `/output/${path.basename(videoPath)}`,
                    userId,
                });

                await video.save();

                res.json({ videoUrl: video.videoUrl });
            });
    } catch (error) {
        console.error('Error generating video:', error);
        for (const imagePath of tempImages) {
            await fs.remove(imagePath);
        }
        if (audioId) {
            const audioFilePath = path.join(outputDir, `temp-audio-${uuidv4()}.mp3`);
            await fs.remove(audioFilePath);
        }
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

module.exports = { generateVideo };
