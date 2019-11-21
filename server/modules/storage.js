    const multer = require('multer');


    module.exports = {
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, '../server/mainServer/uploads');
            },
            filename: function (req, file, cb) {
                console.log(file.fieldname)
                cb(null, file.fieldname + '-' + Date.now()+'.jpg')
            }
        })
    
    }