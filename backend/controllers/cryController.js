const Cry = require('../models/Cry');
const { CRY_INTENSITY, CRY_FELT, CRY_TRIGGERS } = require('../models/Cry');
const { ok, fail, asyncHandler } = require('../utils/response');

const scoped = (req, extra = {}) => ({ userId: req.user._id, ...extra });

/** Normalizes a "YYYY-MM-DD" (or any date-ish) input to that calendar day. */
const dayOf = (value) => {
  const d = value ? new Date(value) : new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// POST /api/cry — log a cry. Always adds a new entry, same reasoning as
// mood check-ins: a day can hold more than one of these.
const checkIn = asyncHandler(async (req, res) => {
  const { intensity, trigger, felt, note, date } = req.body;

  if (!intensity || !CRY_INTENSITY.includes(intensity)) {
    return fail(res, 'That intensity is not one we recognise', 400);
  }
  if (trigger && !CRY_TRIGGERS.includes(trigger)) {
    return fail(res, 'That trigger is not one we recognise', 400);
  }
  if (felt && !CRY_FELT.includes(felt)) {
    return fail(res, 'That "felt after" value is not one we recognise', 400);
  }

  const entry = await Cry.create({
    userId: req.user._id,
    date: dayOf(date),
    intensity,
    trigger: trigger || 'other',
    felt: felt || 'same',
    note: note ?? '',
  });

  return ok(res, { message: 'Cry logged', data: { cry: entry } });
});

// GET /api/cry/today
const getToday = asyncHandler(async (req, res) => {
  const entries = await Cry.find(scoped(req, { date: dayOf() })).sort({ createdAt: 1 }).lean();
  return ok(res, { message: "Today's cries fetched", data: { logs: entries } });
});

// GET /api/cry?from=&to=
const listCry = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = scoped(req);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const logs = await Cry.find(filter).sort({ date: 1, createdAt: 1 }).lean();
  return ok(res, { message: 'Cry logs fetched', data: { logs } });
});

// GET /api/cry/stats?from=&to= — intensity + trigger distribution for the month.
const getStats = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const match = scoped(req);
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
  }

  const logs = await Cry.find(match).lean();
  const counted = logs.length;

  const byIntensity = {};
  const byFelt = {};
  logs.forEach((l) => {
    byIntensity[l.intensity] = (byIntensity[l.intensity] || 0) + 1;
    byFelt[l.felt] = (byFelt[l.felt] || 0) + 1;
  });

  const distribution = CRY_INTENSITY.map((i) => ({
    intensity: i,
    count: byIntensity[i] || 0,
    percent: counted ? Math.round(((byIntensity[i] || 0) / counted) * 100) : 0,
  }));

  return ok(res, {
    message: 'Cry statistics fetched',
    data: {
      distribution,
      countedInRange: counted,
      feltBetter: byFelt.better || 0,
      feltSame: byFelt.same || 0,
      feltWorse: byFelt.worse || 0,
    },
  });
});

// DELETE /api/cry/:id — remove a single logged cry.
const deleteCry = asyncHandler(async (req, res) => {
  const entry = await Cry.findOneAndDelete(scoped(req, { _id: req.params.id }));
  if (!entry) return fail(res, 'We could not find that cry log', 404);
  return ok(res, { message: 'Cry log removed', data: { id: entry._id } });
});

module.exports = { checkIn, getToday, listCry, getStats, deleteCry };
