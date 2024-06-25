const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');
ffmpeg.setFfmpegPath(pathToFfmpeg);

const path = require('path');
const fs = require('fs-extra');
const videoshow = require('videoshow');
const Image = require('../models/Image');
const Video = require('../models/Video');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const generateVideo = async (req, res) => {
    const { prompts } = req.body;
    const userId = req.user.userId;
    const outputDir = path.join(__dirname, '..', 'output');
    const videoPath = path.join(outputDir, `video-${uuidv4()}.mp4`);
    const tempImages = [];

    try {
        await fs.ensureDir(outputDir);

        for (let i = 0; i < prompts.length; i++) {
            const imageRecord = await Image.findOne({ prompt: prompts[i], userId });
            if (!imageRecord) {
                throw new Error('Image not found in database');
            }
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
            loop: 5,
            transition: true,
            transitionDuration: 1,
            videoBitrate: 1024,
            videoCodec: 'libx264',
            size: '1280x?',
            format: 'mp4',
            pixelFormat: 'yuv420p',
            useSubRipSubtitles: false,
            subtitleStyle: {
                Fontname: 'Verdana',
                Fontsize: '26',
                PrimaryColour: '11861244',
                SecondaryColour: '11861244',
                TertiaryColour: '11861244',
                BackColour: '-2147483640',
                Bold: '2',
                Italic: '0',
                BorderStyle: '2',
                Outline: '2',
                Shadow: '3',
                Alignment: '1',
                MarginL: '40',
                MarginR: '60',
                MarginV: '40',
            },
        };

        videoshow(images, videoOptions)
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
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

module.exports = { generateVideo };
