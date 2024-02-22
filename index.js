require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs');

// for parsing application/json
app.use(bodyParser.json());
const uploadsPath = path.join(__dirname, 'uploads')
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000
const bcrypt = require('bcrypt')


const mysqlConnectionFactory = require('./database/MySQLConnection.js')
const upload = require('./multer/multerconfig.js')
const login = require('./controllers/login.js')
const regUser = require('./controllers/registeruser.js')
const validateUser = require('./auth/authMiddleWare.js')

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});


app.use(express.json())
app.get('/', (req, res) => {
  res.send('Heart Beat! Your server is up!')
})

app.post('/postAudio',validateUser, upload.single('file'), (req, res) => {
  if (req.file) {
    res.status(200).send({ message: 'Success' });
  } else {
    res.status(400).send({ message: 'Unsupported file type.' });
  }
});

app.get('/home',validateUser, (req, res) => {
  //I want to return a list of the audio metadata that is there currently in /uploads
  try {
    fs.readdir(uploadsPath, (err, files) => {
      if (err)
        res.status(500).json({ message: "Error Occured while facing files from folder" })
      // Sort files by modified time (newest first)
      files.sort((a, b) => {
        const statA = fs.statSync(path.join(uploadsPath, a));
        const statB = fs.statSync(path.join(uploadsPath, b));
        return statB.mtime.getTime() - statA.mtime.getTime();
      });
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(process.env.PAGE_SIZE);
      const totalPages=files.length/pageSize // Adjust as needed
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
      const paginatedFiles = files.slice(startIndex, endIndex);

      const fileList = paginatedFiles.map((audioFile, idx) =>
      ({
        id: idx + 1,
        title: audioFile,
        fileName: audioFile,
        path: `/uploads/${audioFile}`
      }))

      res.status(200).json({
        page: page,
        totalPages:totalPages,
        pageSize: pageSize,
        totalFiles: files.length,
        fileList: fileList
      })
    })
  } catch (error) {
    console.error('Error fetching audio metadata:', error);
    res.status(500).json({ error: 'Internal server error' });

  }


})


app.post('/regUser', regUser);
app.post('/login', login);

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)

  // server.js (continuation)
  process.on('SIGINT', async () => {
    try {
      const connection = await mysqlConnectionFactory.getConnection();

      await connection.close();
      console.log('MySQL connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error closing MySQL connection:', error.message);
      process.exit(1);
    }
  });

})