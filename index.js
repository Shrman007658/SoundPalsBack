require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000
const multer = require('multer')

const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    console.log('filename')
    cb(null, file.originalname)
  },
  destination: function (req,file,cb) {
    console.log(storage)
    cb(null,'./uploads')
  }
})

const upload = multer({storage})



app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/postAudio',upload.single('file'),(req,res)=>
{
  console.log(req.body)
  console.log(req.file)
  res.send({message: "Success"})
})

app.post('/login',(req,res)=> 
{

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})