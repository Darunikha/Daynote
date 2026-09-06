const multer = require('multer');

// Files are held in memory then streamed straight to Cloudinary.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|gif|avif)$/.test(file.mimetype)) return cb(null, true);
    return cb(new Error('Only image files are supported'));
  },
});

module.exports = upload;
