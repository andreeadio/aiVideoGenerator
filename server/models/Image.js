const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true,
    },
    imageData: {
        type: String, // Store base64 encoded image data
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Image', imageSchema);
