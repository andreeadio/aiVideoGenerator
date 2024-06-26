const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Audio = mongoose.model('Audio', audioSchema);
module.exports = Audio;
