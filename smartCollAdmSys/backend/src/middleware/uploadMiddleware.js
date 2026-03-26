const multer = require('multer');

// Multer stores uploaded files in memory so we can forward them to Python.
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;
