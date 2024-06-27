const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');
ffmpeg.setFfmpegPath(pathToFfmpeg);

const path = require('path');
const fs = require('fs-extra');
const videoshow = require('videoshow');
const Image = require('../models/Image');
const Audio = require('../models/Audio');
const Video = require('../models/Video');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const getAudioDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
};

const generateVideo = async (req, res) => {
    const { prompts: rawPrompts, duration, audioId } = req.body;

    if (!audioId) {
        console.error('Audio ID is missing');
        return res.status(400).json({ error: 'Audio ID is required' });
    }

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
            caption: 'AI generated content', // Add watermark as a caption
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
            useSubRipSubtitles: false,
            subtitleStyle: {
                Fontname: 'Verdana',
                Fontsize: '14',
                PrimaryColour: '11861244',
                SecondaryColour: '11861244',
                TertiaryColour: '11861244',
                BackColour: '-2147483640',
                Bold: '2',
                Italic: '0',
                BorderStyle: '2',
                Outline: '2',
                Shadow: '3',
                Alignment: '6', // Top right corner
                MarginL: '40',
                MarginR: '40',
                MarginV: '10',
            },
        };

        const videoBuilder = videoshow(images, videoOptions);

        const audioRecord = await Audio.findById(audioId);

        if (!audioRecord) {
            console.error('Audio file not found in database');
            throw new Error('Audio file not found in database');
        }

        const audioFilePath = path.join(outputDir, `temp-audio-${uuidv4()}.mp3`);
        await fs.writeFile(audioFilePath, audioRecord.data);

        const audioDuration = await getAudioDuration(audioFilePath);
        const videoDuration = prompts.length * duration;

        let processedAudioPath = audioFilePath;

        if (audioDuration < videoDuration) {
            // Loop the audio if it's shorter than the video duration
            const loopedAudioPath = path.join(outputDir, `looped-audio-${uuidv4()}.mp3`);
            await new Promise((resolve, reject) => {
                ffmpeg(audioFilePath)
                    .inputOptions(['-stream_loop', '-1']) // Loop the audio
                    .duration(videoDuration) // Set the duration to match the video
                    .save(loopedAudioPath)
                    .on('end', () => resolve(loopedAudioPath))
                    .on('error', (err) => reject(err));
            });
            processedAudioPath = loopedAudioPath;
        } else if (audioDuration > videoDuration) {
            // Truncate the audio if it's longer than the video duration
            const truncatedAudioPath = path.join(outputDir, `truncated-audio-${uuidv4()}.mp3`);
            await new Promise((resolve, reject) => {
                ffmpeg(audioFilePath)
                    .setDuration(videoDuration) // Truncate the audio to match the video duration
                    .save(truncatedAudioPath)
                    .on('end', () => resolve(truncatedAudioPath))
                    .on('error', (err) => reject(err));
            });
            processedAudioPath = truncatedAudioPath;
        }

        videoBuilder.audio(processedAudioPath);

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
                if (processedAudioPath !== audioFilePath) {
                    await fs.remove(processedAudioPath);
                }
                await fs.remove(audioFilePath);

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
