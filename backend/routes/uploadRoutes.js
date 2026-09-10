const express = require('express');
const { uploadImage, uploadAudioFile, uploadStatus } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadAudio } = require('../middleware/upload');

const router = express.Router();

router.get('/status', uploadStatus);
router.post('/', protect, upload.single('image'), uploadImage);
router.post('/audio', protect, uploadAudio.single('audio'), uploadAudioFile);

module.exports = router;
