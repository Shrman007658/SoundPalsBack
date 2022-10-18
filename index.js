require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000
const multer = require('multer')
const mysql = require('mysql2');

const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database : 'Users',
    port: 13306
  }
)
connection.connect((err) => 
{
  if(err)
  {
    console.log('Connection Error' + err.stack)
    return;
  }
  else
  console.log('Connection Done')
})
connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

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