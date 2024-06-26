const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra'); // Add this for directory checks and creation

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
fs.ensureDirSync(uploadDir);

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Ensure this path is correct
    },
    filename: function (req, file, cb) {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('audio'); // Ensure this matches the form field name

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /mp3|mpeg|wav|m4a/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Audio Files Only!');
    }
}

module.exports = upload;
