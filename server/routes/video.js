const express = require('express')
const router = express.Router()
const { generateVideo } = require('../controllers/hfVideoController')

//http requests here
router.post('/generate-video', generateVideo)

module.exports = router