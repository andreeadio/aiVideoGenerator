const axios = require('axios');
require('dotenv').config();
const HF_API_URL = "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-1.3B";
const HF_API_KEY = process.env.HF_API_KEY;


const generateDescriptions = async (req, res) => {
    const { numScenes, topic } = req.body;
    const prompt = `Generate ${numScenes} scene descriptions about the topic: ${topic}`;

    try {
        const response = await axios.post(
            HF_API_URL,
            { inputs: prompt },
            {
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`
                }
            }
        );

        if (response.status === 200) {
            // Assuming the API returns the descriptions directly, otherwise you might need to process the data.
            res.json({ descriptions: response.data });
        } else {
            res.status(response.status).json({ error: response.data.error || 'Failed to fetch descriptions' });
        }
    } catch (error) {
        console.error('Failed to generate descriptions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { generateDescriptions };
