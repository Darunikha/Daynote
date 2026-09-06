const express = require('express');
const { updateProfile, updatePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/me', deleteAccount);

module.exports = router;
