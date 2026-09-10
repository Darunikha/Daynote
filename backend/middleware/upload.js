const multer = require('multer');

// Files are held in memory then streamed straight to Cloudinary.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype) || file.mimetype === 'application/octet-stream') return cb(null, true);
    return cb(new Error('Only image files are supported'));
  },
});

const uploadAudio = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    if (/^(audio|video)\//.test(file.mimetype) || file.mimetype === 'application/octet-stream') return cb(null, true);
    return cb(new Error('Only audio files are supported'));
  },
});

module.exports = upload;
module.exports.uploadAudio = uploadAudio;
