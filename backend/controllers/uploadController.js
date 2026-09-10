const { isCloudinaryConfigured, uploadBuffer } = require('../config/cloudinary');
const { ok, fail, asyncHandler } = require('../utils/response');

// GET /api/upload/status -> lets the UI hide the uploader when it is not available
const uploadStatus = (req, res) =>
  ok(res, {
    message: isCloudinaryConfigured ? 'Image upload is available' : 'Image upload is not configured',
    data: { enabled: isCloudinaryConfigured },
  });

// POST /api/upload
const uploadImage = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured) {
    return fail(res, 'Image upload is not set up on this server yet', 503);
  }
  if (!req.file) return fail(res, 'Please choose an image to upload', 400);

  const result = await uploadBuffer(req.file.buffer, `daynote/${req.user._id}`, 'image');
  return ok(res, {
    message: 'Image uploaded successfully',
    data: { imageUrl: result.secure_url, publicId: result.public_id },
  });
});

// POST /api/upload/audio
const uploadAudioFile = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured) {
    return fail(res, 'Cloudinary is not set up on this server yet', 503);
  }
  if (!req.file) return fail(res, 'Please provide an audio recording to upload', 400);

  const result = await uploadBuffer(req.file.buffer, `daynote/${req.user._id}/audio`, 'video');
  return ok(res, {
    message: 'Audio uploaded successfully',
    data: { audioUrl: result.secure_url, publicId: result.public_id },
  });
});

module.exports = { uploadImage, uploadAudioFile, uploadStatus };
