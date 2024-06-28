const axios = require('axios');
require('dotenv').config();

const OpenAI = require("openai");

const openai = new OpenAI();

const generateDescriptions = async (req, res) => {
    const { topic, numScenes } = req.body;
    // const systemMessage = "You are a helpful assistant specialized in generating creative content.";
    const userMessage = `write me ${numScenes} detailed prompt descriptions for images which will be used in the creation of a video. the video should be about ${topic}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                // { "role": "system", "content": systemMessage },
                { "role": "user", "content": userMessage }
            ]
        });

        if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
            const descriptions = completion.choices[0].message.content.split('\n').filter(line => line.trim() !== '');
            res.json({ descriptions });
        } else {
            res.status(404).json({ error: 'No descriptions found in the response' });
        }
    } catch (error) {
        console.error('Failed to generate descriptions:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

module.exports = { generateDescriptions };

