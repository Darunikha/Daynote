const express = require('express');
const { checkIn, getToday, listMoods, getStats } = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/today', getToday);
router.get('/stats', getStats);
router.route('/').get(listMoods).post(checkIn);

module.exports = router;
