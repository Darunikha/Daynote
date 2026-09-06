const express = require('express');
const {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
  toggleFavorite,
  getStats,
  getTags,
} = require('../controllers/journalController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Everything below belongs to the signed-in user only.
router.use(protect);

router.get('/stats', getStats);
router.get('/tags', getTags);

router.route('/').get(getJournals).post(createJournal);
router.route('/:id').get(getJournal).put(updateJournal).delete(deleteJournal);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
