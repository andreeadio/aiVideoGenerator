// const axios = require('axios');
// const Image = require('../models/Image');
// require('dotenv').config();

// const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
// const HF_API_KEY = process.env.HF_API_KEY;

// const generateImage = async (req, res) => {
//     const { prompt } = req.body;
//     const userId = req.user.userId;

//     try {
//         console.log(`Generating image for prompt: ${prompt}`);

//         // Check if an image with the same prompt and userId already exists
//         let image = await Image.findOne({ prompt, userId });

//         if (!image) {
//             // If no existing image is found, generate a new one
//             const response = await axios.post(HF_API_URL, {
//                 inputs: prompt,
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${HF_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//                 responseType: 'arraybuffer',
//             });

//             if (response.status !== 200) {
//                 console.error(`Error from API for prompt: `, response.data);
//                 return res.status(response.status).json({ error: 'Error generating image from API' });
//             }

//             const buffer = Buffer.from(response.data, 'binary');
//             const base64Image = buffer.toString('base64');
//             const imageUrl = `data:image/png;base64,${base64Image}`;

//             // Create a new image document and save it to the database
//             image = new Image({
//                 prompt,
//                 imageData: imageUrl,
//                 userId,
//             });

//             await image.save();

//             console.log(`Image generated and saved for prompt: ${prompt}`);
//         } else {
//             // If an existing image is found, update it with the new image data
//             const response = await axios.post(HF_API_URL, {
//                 inputs: prompt,
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${HF_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//                 responseType: 'arraybuffer',
//             });

//             if (response.status !== 200) {
//                 console.error(`Error from API for prompt: `, response.data);
//                 return res.status(response.status).json({ error: 'Error generating image from API' });
//             }

//             const buffer = Buffer.from(response.data, 'binary');
//             const base64Image = buffer.toString('base64');
//             const imageUrl = `data:image/png;base64,${base64Image}`;

//             image.imageData = imageUrl;
//             await image.save();

//             console.log(`Image updated and saved for prompt: ${prompt}`);
//         }

//         res.json({ imageUrl: image.imageData });
//     } catch (error) {
//         console.error('Error generating image:', error);

//         if (error.response && error.response.status === 503) {
//             res.status(503).json({ error: 'Service unavailable. Please try again later.' });
//         } else {
//             res.status(500).json({ error: 'Internal server error. Please try again later.' });
//         }
//     }
// };

// module.exports = { generateImage };

const axios = require('axios');
const Image = require('../models/Image');
require('dotenv').config();
const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HF_API_KEY = process.env.HF_API_KEY;

const generateImage = async (req, res) => {
    const { prompt } = req.body;
    const userId = req.user.userId;
    try {
        console.log(`Generating image for prompt: ${prompt}`);
        const response = await axios.post(HF_API_URL, {
            inputs: prompt,
        }, {
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
        });
        if (response.status !== 200) {
            console.error(`Error from API for prompt: `, response.data);
            return res.status(response.status).json({ error: 'Error generating image from API' });
        }
        const buffer = Buffer.from(response.data, 'binary');
        const base64Image = buffer.toString('base64');
        const imageUrl = `data:image/png;base64,${base64Image}`;

        // Check if an image with the same prompt and userId already exists
        let image = await Image.findOne({ prompt, userId });

        if (!image) {
            // If no existing image is found, create a new image document
            image = new Image({
                prompt,
                imageData: imageUrl,
                userId,
            });
        } else {
            // If an existing image is found, update it with the new image data
            image.imageData = imageUrl;
        }

        await image.save();
        console.log(`Image generated and saved for prompt: ${prompt}`);

        res.json({ imageUrl: image.imageData });
    } catch (error) {
        console.error('Error generating image:', error);

        if (error.response && error.response.status === 503) {
            res.status(503).json({ error: 'Service unavailable. Please try again later.' });
        } else {
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    }
};

module.exports = { generateImage };
