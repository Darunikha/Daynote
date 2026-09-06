const express = require('express');
const { uploadImage, uploadStatus } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/status', uploadStatus);
router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;
