const Sleep = require('../models/Sleep');
const { SLEEP_QUALITY } = require('../models/Sleep');
const { ok, fail, asyncHandler } = require('../utils/response');

const scoped = (req, extra = {}) => ({ userId: req.user._id, ...extra });

/** Normalizes a "YYYY-MM-DD" (or any date-ish) input to that calendar day. */
const dayOf = (value) => {
  const d = value ? new Date(value) : new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Minutes asleep, assuming wake is the next morning whenever it isn't later than bedtime. */
const durationMinutes = (bedTime, wakeTime) => {
  const bed = toMinutes(bedTime);
  const wake = toMinutes(wakeTime);
  return wake <= bed ? 1440 - bed + wake : wake - bed;
};

/** Adds the derived duration onto a plain (lean) sleep log for the response. */
const withDuration = (log) => ({ ...log, durationMinutes: durationMinutes(log.bedTime, log.wakeTime) });

// POST /api/sleep — log (or update) last night's sleep for a given morning.
const checkIn = asyncHandler(async (req, res) => {
  const { date, bedTime, wakeTime, quality, notes } = req.body;

  if (!bedTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(bedTime)) {
    return fail(res, 'That bedtime is not a valid time', 400);
  }
  if (!wakeTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(wakeTime)) {
    return fail(res, 'That wake time is not a valid time', 400);
  }
  if (quality && !SLEEP_QUALITY.includes(quality)) {
    return fail(res, 'That sleep quality is not one we recognise', 400);
  }

  const day = dayOf(date);
  const entry = await Sleep.findOneAndUpdate(
    { userId: req.user._id, date: day },
    { bedTime, wakeTime, quality: quality || 'fair', notes: notes ?? '' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return ok(res, { message: 'Sleep logged', data: { sleep: withDuration(entry) } });
});

// GET /api/sleep/today
const getToday = asyncHandler(async (req, res) => {
  const entry = await Sleep.findOne(scoped(req, { date: dayOf() })).lean();
  return ok(res, { message: "Today's sleep fetched", data: { sleep: entry ? withDuration(entry) : null } });
});

// GET /api/sleep?from=&to=
const listSleep = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = scoped(req);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const logs = await Sleep.find(filter).sort({ date: 1 }).lean();
  return ok(res, { message: 'Sleep logs fetched', data: { logs: logs.map(withDuration) } });
});

// GET /api/sleep/stats?from=&to= — averages + quality distribution for the month.
const getStats = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = scoped(req);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const logs = await Sleep.find(filter).lean();
  const durations = logs.map((l) => durationMinutes(l.bedTime, l.wakeTime));
  const avgMinutes = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const byQuality = {};
  logs.forEach((l) => {
    byQuality[l.quality] = (byQuality[l.quality] || 0) + 1;
  });
  const distribution = SLEEP_QUALITY.map((q) => ({
    quality: q,
    count: byQuality[q] || 0,
    percent: logs.length ? Math.round(((byQuality[q] || 0) / logs.length) * 100) : 0,
  }));

  return ok(res, {
    message: 'Sleep statistics fetched',
    data: {
      avgMinutes,
      nightsLogged: logs.length,
      distribution,
      shortestMinutes: durations.length ? Math.min(...durations) : 0,
      longestMinutes: durations.length ? Math.max(...durations) : 0,
    },
  });
});

// DELETE /api/sleep/:id
const deleteSleep = asyncHandler(async (req, res) => {
  const entry = await Sleep.findOneAndDelete(scoped(req, { _id: req.params.id }));
  if (!entry) return fail(res, 'We could not find that sleep log', 404);
  return ok(res, { message: 'Sleep log removed', data: { id: entry._id } });
});

module.exports = { checkIn, getToday, listSleep, getStats, deleteSleep };
