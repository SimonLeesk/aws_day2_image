require('dotenv').config()

const express = require("express")
const multer = require("multer")
const fs = require('fs')
const path = require("path")

const database = require('./database')

const upload = multer({ dest: 'images/' })

const app = express()

app.use(express.static(path.join(__dirname, "build")))

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
  })

app.get("/api/images", async (req, res) => {
    const images = await database.getImages()

    res.send({images})
})

app.post("/api/images", upload.single('image'), async (req, res) => {  
    const imagePath = req.file.path
    const description = req.body.description
  
    // Save this data to a database probably
    const image = await database.addImage(imagePath, description)
  
    res.send({image})
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))
