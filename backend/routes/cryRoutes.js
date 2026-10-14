const express = require('express');
const { checkIn, getToday, listCry, getStats, deleteCry } = require('../controllers/cryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/today', getToday);
router.get('/stats', getStats);
router.route('/').get(listCry).post(checkIn);
router.delete('/:id', deleteCry);

module.exports = router;
