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
const bcrypt = require('bcrypt')
const mysqlConnectionFactory = require('./database/MySQLConnection.js')
const upload = require('./multer/multerconfig.js')
const login = require('./controllers/login.js')
const regUser = require('./controllers/registeruser.js')

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});


app.use(express.json())
app.get('/', (req, res) => {
  res.send('Heart Beat! Your server is up!')
})

app.post('/postAudio', upload.single('file'), (req, res) => {
  if (req.file) {
    res.status(200).send({ message: 'Success' });
  } else {
    res.status(400).send({ message: 'Unsupported file type.' });
  }
});




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