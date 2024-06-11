require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');

const cors = require('cors')
const express = require('express')
const app = express()

const videoRouter = require('./routes/video');
const imageRouter = require('./routes/image')

//middlewares
app.use(bodyParser.json())
app.use(cors(
    {
        origin: 'http://localhost:3000', // Replace with your frontend's origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
)
)


//routes
app.use('/api', videoRouter)
app.use('/api', imageRouter)

app.use('/output', express.static(path.join(__dirname, 'output')));


const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

