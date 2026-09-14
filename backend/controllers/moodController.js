const Mood = require('../models/Mood');
const { MOODS } = require('../models/Journal');
const { ok, fail, asyncHandler } = require('../utils/response');

const scoped = (req, extra = {}) => ({ userId: req.user._id, ...extra });

/** Normalizes a "YYYY-MM-DD" (or any date-ish) input to that calendar day. */
const dayOf = (value) => {
  const d = value ? new Date(value) : new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// POST /api/moods — record (or update) how someone feels on a given day.
const checkIn = asyncHandler(async (req, res) => {
  const { mood, date, note } = req.body;

  if (!mood || !MOODS.includes(mood)) {
    return fail(res, 'That mood is not one we recognise', 400);
  }

  const day = dayOf(date);
  const entry = await Mood.findOneAndUpdate(
    { userId: req.user._id, date: day },
    { mood, note: note ?? '' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return ok(res, { message: 'Mood recorded', data: { mood: entry } });
});

// GET /api/moods/today
const getToday = asyncHandler(async (req, res) => {
  const entry = await Mood.findOne(scoped(req, { date: dayOf() }));
  return ok(res, { message: 'Today’s mood fetched', data: { mood: entry || null } });
});

// GET /api/moods?from=&to=
const listMoods = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = scoped(req);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const moods = await Mood.find(filter).sort({ date: 1 }).lean();
  return ok(res, { message: 'Moods fetched', data: { moods } });
});

// GET /api/moods/stats?from=&to= — same shape as journalController.getStats
// so the existing MoodDonut/MoodBars/MoodLegend components can be reused as-is.
const getStats = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const match = scoped(req);
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
  }

  const byMood = await Mood.aggregate([
    { $match: match },
    { $group: { _id: '$mood', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const counted = byMood.reduce((sum, b) => sum + b.count, 0);
  const distribution = MOODS.map((m) => ({
    mood: m,
    count: byMood.find((b) => b._id === m)?.count || 0,
  }));

  return ok(res, {
    message: 'Mood statistics fetched',
    data: {
      distribution: distribution.map((d) => ({
        ...d,
        percent: counted ? Math.round((d.count / counted) * 100) : 0,
      })),
      topMood: byMood[0]?._id || null,
      countedInRange: counted,
    },
  });
});

module.exports = { checkIn, getToday, listMoods, getStats };
