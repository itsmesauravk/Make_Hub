const multer = require('multer');

const uploader= multer({
    storage: multer.diskStorage({}),
});

module.exports = uploader;