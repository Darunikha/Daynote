const express = require('express');
const { checkIn, updateMood, deleteMood, getToday, listMoods, getStats } = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/today', getToday);
router.get('/stats', getStats);
router.route('/').get(listMoods).post(checkIn);
router.route('/:id').patch(updateMood).delete(deleteMood);

module.exports = router;
