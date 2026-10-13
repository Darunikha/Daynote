const express = require('express');
const { checkIn, getToday, listSleep, getStats, deleteSleep } = require('../controllers/sleepController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/today', getToday);
router.get('/stats', getStats);
router.route('/').get(listSleep).post(checkIn);
router.delete('/:id', deleteSleep);

module.exports = router;
