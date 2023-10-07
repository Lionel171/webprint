var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './resources/assets')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, Date.now() + '.' + extension) //Appending .jpg
  }
})
var uploadFile = multer({ 
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 1024 }
}).any();

module.exports = uploadFile;


