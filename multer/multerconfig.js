const multer = require('multer')

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
    destination: function (req, file, cb) {
      cb(null, './uploads')
    }
  })
  
  const upload = multer({ storage: storage, fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true); // Accept the file
    } else {
      cb(null, false); // Reject the file
    }
  } })

module.exports = upload;