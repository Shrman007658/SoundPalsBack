require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const bodyParser = require('body-parser')

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000
const multer = require('multer')
const mysql = require('mysql2');
const bcrypt = require('bcrypt')

const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Users',
    port: 13306
  }
)
connection.connect((err) => {
  if (err) {
    console.log('Connection Error' + err.stack)
    return;
  }
  else
    console.log('Connection Done')
})

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log('filename')
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    console.log(storage)
    cb(null, './uploads')
  }
})

const upload = multer({ storage })



app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/postAudio', upload.single('file'), (req, res) => {
  console.log(req.body)
  console.log(req.file)
  if (req.file.mimetype === 'audio/mpeg')
    res.status(200).send({ message: "Success" })
  else
    res.status(400).send({ message: "Unsupported File Type" })
})


app.post('/regUser', async (req, res) => {
  //User sends in username, first name , last name and password. 
  //First we check whether the username already exists. If it exists, then the request is returned with error. 
  //Otherwise, we hash it, and store it in db. 
  const userName = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;

  console.log(userName, password, firstName, lastName);
  //sanitize userInput and only allow SQL if the username is containing [A-Za-z]
  const onlyLettersPattern = /^[A-Za-z0-9]+$/;
  if (onlyLettersPattern.test(userName) && onlyLettersPattern.test(password)
    && onlyLettersPattern.test(firstName) && onlyLettersPattern.test(lastName)) {
    //Only if all are matching then register. Else return error. 
    //Check if userName already exists. if Yes return error. if flase then go ahead. 
    connection.query('SELECT userId from User where userName = ?', [userName], async (err, rows, fields) => {
      if (err)
        res.status(500).send({ message: "Error while Querying DB" })
        console.log(rows.length)
      if (rows.length > 0) {

        res.status(400).send({ message: "UserName Already Exists." })
      }
      else
      {
        //hash password with bcrypt
        const salt = await bcrypt.genSalt(11)
        const hashedPassword = await bcrypt.hash(password,salt)
        connection.query('INSERT into User (LastName,FirstName,userName,pass) values (?,?,?,?)', [lastName, firstName, userName, hashedPassword], (err, result, fields) => {
          if (err)
            res.status(500).send({ message: err })
          res.status(200).send({ message: "User Created" })
        })
      }
    })
  }
  else
    return res.status(400).send({ message: "Invalid Character in Input form" })
})
app.post('/login', (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    const onlyLettersPattern = /^[A-Za-z0-9]+$/;
    if (onlyLettersPattern.test(userName) && onlyLettersPattern.test(password))
    {
      connection.query('SELECT pass from User where userName = ?',[userName],async (err,result,connection) =>
      {
        if(err) 
        {
          console.log(err)
          res.status(500).send({message:'Error Occured'})
        }
        if(result.length == 0)
        {
          res.status(401).send({message:'Username Does Not Exist'})
        }
        else
        {
          const pass = result[0].pass;
          if(await bcrypt.compare(password,pass))
          {
            res.status(200).send({message:"Login Success!"})
          }
          else
          res.status(400).send({message:"Login Failure. Incorrect password."})
        }

      }) 
    }
    else
    return res.status(400).send({ message: "Invalid Character in Input form" })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})