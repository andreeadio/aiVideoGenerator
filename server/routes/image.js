const express = require('express')
const router = express.Router()
const { generateImage } = require('../controllers/imageController')

//http requests here
router.post('/generate-image', generateImage)

module.exports = router