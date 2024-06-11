//generate an image

const axios = require('axios');
const path = require('path')
const fs = require('fs-extra')
require('dotenv').config();



//const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
//"https://api-inference.huggingface.co/models/Corcelio/mobius"
//api url and api key
const HF_API_URL = "https://api-inference.huggingface.co/models/sd-community/sdxl-flash"
const HF_API_KEY = process.env.HF_API_KEY

const generateImage = async (req, res) => {
    const { prompt, index } = req.body
    const outputDir = path.join(__dirname, '..', 'output')

    try {

        console.log(`Generating image for prompt: ${prompt}`);

        const response = await axios.post(HF_API_URL, {
            inputs: prompt
        }, {
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
        });

        if (response.status !== 200) {
            console.error(`Error from API for prompt: `, response.data); // Debugging statement
            return res.status(response.status).json({ error: 'Error generating image from API' });
        }

        const buffer = Buffer.from(response.data, 'binary');
        const imagePath = path.join(outputDir, `image${index}.png`);
        await fs.writeFile(imagePath, buffer);
        console.log(`Image saved at ${imagePath}`); // Debugging statement
        res.json({ imageUrl: `http://localhost:8080/output/image${index}.png` });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = { generateImage }
