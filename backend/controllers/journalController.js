const Journal = require('../models/Journal');
const { MOODS, PAPER_STYLES, DECORATIONS } = require('../models/Journal');
const { ok, fail, asyncHandler } = require('../utils/response');

/** Every query is locked to the signed-in user, so entries can never leak across accounts. */
const scoped = (req, extra = {}) => ({ userId: req.user._id, ...extra });

/** Escapes user input so a search term is matched literally, not as a pattern. */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/journals
const getJournals = asyncHandler(async (req, res) => {
  const { search, mood, tag, favorite, from, to, sort = 'newest', drafts, timeCapsule, hasAudio } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 60);

  const filter = scoped(req);

  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ title: rx }, { content: rx }, { tags: rx }];
  }
  if (mood && mood !== 'all') filter.mood = mood;
  if (tag) filter.tags = tag.trim().toLowerCase();
  if (favorite === 'true') filter.isFavorite = true;
  if (drafts === 'true') filter.isDraft = true;
  if (drafts === 'false') filter.isDraft = false;
  if (timeCapsule === 'true') filter.isTimeCapsule = true;
  if (hasAudio === 'true') filter.audioUrl = { $exists: true, $ne: '' };

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const sortSpec = sort === 'oldest' ? { date: 1, createdAt: 1 } : { date: -1, createdAt: -1 };

  const [entries, total] = await Promise.all([
    Journal.find(filter)
      .sort(sortSpec)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Journal.countDocuments(filter),
  ]);

  const sanitizedEntries = entries.map((entry) => {
    const isCapsuleLocked =
      Boolean(entry.isTimeCapsule) && Boolean(entry.unlockDate) && new Date(entry.unlockDate) > new Date();

    if (entry.isLocked) {
      return {
        ...entry,
        content: '🔒 This entry is password protected.',
        imageUrl: '',
        audioUrl: '',
        audioTranscript: '',
        isCapsuleLocked,
      };
    }
    if (isCapsuleLocked) {
      const unlockStr = new Date(entry.unlockDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return {
        ...entry,
        content: `⏳ Time Capsule Sealed — Unlocks on ${unlockStr}`,
        imageUrl: '',
        audioUrl: '',
        audioTranscript: '',
        isCapsuleLocked: true,
      };
    }
    return { ...entry, isCapsuleLocked: false };
  });

  return ok(res, {
    message: 'Journal entries fetched successfully',
    data: {
      entries: sanitizedEntries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    },
  });
});

// GET /api/journals/stats  -> mood distribution + streak info for the dashboard
const getStats = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const match = scoped(req);
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
  }

  const [byMood, totals] = await Promise.all([
    Journal.aggregate([
      { $match: match },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Journal.aggregate([
      { $match: scoped(req) },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          favorites: { $sum: { $cond: ['$isFavorite', 1, 0] } },
        },
      },
    ]),
  ]);

  const distribution = MOODS.map((m) => ({
    mood: m,
    count: byMood.find((b) => b._id === m)?.count || 0,
  }));
  const counted = byMood.reduce((sum, b) => sum + b.count, 0);

  return ok(res, {
    message: 'Mood statistics fetched successfully',
    data: {
      distribution: distribution.map((d) => ({
        ...d,
        percent: counted ? Math.round((d.count / counted) * 100) : 0,
      })),
      topMood: byMood[0]?._id || null,
      countedInRange: counted,
      totalEntries: totals[0]?.total || 0,
      totalFavorites: totals[0]?.favorites || 0,
    },
  });
});

// GET /api/journals/tags -> distinct tags for filter chips
const getTags = asyncHandler(async (req, res) => {
  const tags = await Journal.distinct('tags', scoped(req));
  return ok(res, { message: 'Tags fetched successfully', data: { tags: tags.sort() } });
});

// GET /api/journals/:id
const getJournal = asyncHandler(async (req, res) => {
  const entry = await Journal.findOne(scoped(req, { _id: req.params.id })).select('+lockPassword');
  if (!entry) return fail(res, 'We could not find that entry', 404);

  const isCapsuleLocked =
    Boolean(entry.isTimeCapsule) && Boolean(entry.unlockDate) && new Date(entry.unlockDate) > new Date();

  if (entry.isLocked) {
    const passwordHeader = req.headers['x-entry-password'] || req.query.password;
    let unlocked = false;
    if (passwordHeader) {
      unlocked = await entry.matchLockPassword(passwordHeader);
    }
    if (!unlocked) {
      const masked = entry.toObject();
      delete masked.lockPassword;
      masked.content = '🔒 This entry is password protected.';
      masked.imageUrl = '';
      masked.audioUrl = '';
      masked.audioTranscript = '';
      masked.isLocked = true;
      masked.isCapsuleLocked = isCapsuleLocked;
      return ok(res, { message: 'Journal entry is locked', data: { entry: masked, isUnlocked: false } });
    }
  }

  const obj = entry.toObject();
  delete obj.lockPassword;
  obj.isCapsuleLocked = isCapsuleLocked;

  if (isCapsuleLocked) {
    const unlockStr = new Date(entry.unlockDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    obj.content = `⏳ Time Capsule Sealed — Unlocks on ${unlockStr}`;
    obj.imageUrl = '';
    obj.audioUrl = '';
    obj.audioTranscript = '';
  }

  return ok(res, { message: 'Journal entry fetched successfully', data: { entry: obj, isUnlocked: !entry.isLocked } });
});

const pickBody = (body) => {
  const out = {};
  if (body.title !== undefined) out.title = String(body.title).trim() || 'Untitled entry';
  if (body.content !== undefined) out.content = body.content;
  if (body.mood !== undefined) out.mood = body.mood;
  if (body.paperStyle !== undefined) out.paperStyle = body.paperStyle;
  if (body.decoration !== undefined) out.decoration = body.decoration;
  if (body.tags !== undefined) {
    out.tags = Array.isArray(body.tags)
      ? body.tags
      : String(body.tags)
          .split(',')
          .map((t) => t.trim());
  }
  if (body.date !== undefined && body.date) out.date = new Date(body.date);
  if (body.isFavorite !== undefined) out.isFavorite = Boolean(body.isFavorite);
  if (body.isDraft !== undefined) out.isDraft = Boolean(body.isDraft);
  if (body.imageUrl !== undefined) out.imageUrl = body.imageUrl;
  if (body.isTimeCapsule !== undefined) out.isTimeCapsule = Boolean(body.isTimeCapsule);
  if (body.unlockDate !== undefined) out.unlockDate = body.unlockDate ? new Date(body.unlockDate) : null;
  if (body.audioUrl !== undefined) out.audioUrl = body.audioUrl;
  if (body.audioTranscript !== undefined) out.audioTranscript = body.audioTranscript;
  return out;
};

// POST /api/journals
const createJournal = asyncHandler(async (req, res) => {
  const payload = pickBody(req.body);

  if (!payload.content || !String(payload.content).trim()) {
    return fail(res, 'Write something before saving this entry', 400);
  }
  if (payload.mood && !MOODS.includes(payload.mood)) {
    return fail(res, 'That mood is not one we recognise', 400);
  }
  if (payload.paperStyle && !PAPER_STYLES.includes(payload.paperStyle)) {
    return fail(res, 'That paper style is not one we recognise', 400);
  }
  if (payload.decoration && !DECORATIONS.includes(payload.decoration)) {
    return fail(res, 'That decoration is not one we recognise', 400);
  }

  const entry = new Journal({ ...payload, userId: req.user._id });
  if (req.body.lockPassword && String(req.body.lockPassword).trim()) {
    await entry.setLockPassword(String(req.body.lockPassword).trim());
  }
  await entry.save();

  const obj = entry.toObject();
  delete obj.lockPassword;

  return ok(res, {
    status: 201,
    message: payload.isDraft ? 'Draft saved successfully' : 'Journal entry created successfully',
    data: { entry: obj },
  });
});

// PUT /api/journals/:id
const updateJournal = asyncHandler(async (req, res) => {
  const payload = pickBody(req.body);

  if (payload.content !== undefined && !String(payload.content).trim()) {
    return fail(res, 'An entry cannot be empty', 400);
  }
  if (payload.mood && !MOODS.includes(payload.mood)) {
    return fail(res, 'That mood is not one we recognise', 400);
  }
  if (payload.paperStyle && !PAPER_STYLES.includes(payload.paperStyle)) {
    return fail(res, 'That paper style is not one we recognise', 400);
  }
  if (payload.decoration && !DECORATIONS.includes(payload.decoration)) {
    return fail(res, 'That decoration is not one we recognise', 400);
  }

  const entry = await Journal.findOne(scoped(req, { _id: req.params.id })).select('+lockPassword');
  if (!entry) return fail(res, 'We could not find that entry', 404);

  // If entry is locked, check if lockPassword was passed in body to edit or update lock password
  if (req.body.lockPassword && String(req.body.lockPassword).trim()) {
    await entry.setLockPassword(String(req.body.lockPassword).trim());
  }

  Object.assign(entry, payload);
  await entry.save();

  const obj = entry.toObject();
  delete obj.lockPassword;

  return ok(res, { message: 'Journal entry updated successfully', data: { entry: obj } });
});

// DELETE /api/journals/:id
const deleteJournal = asyncHandler(async (req, res) => {
  const entry = await Journal.findOneAndDelete(scoped(req, { _id: req.params.id }));
  if (!entry) return fail(res, 'We could not find that entry', 404);
  return ok(res, { message: 'Journal entry deleted successfully', data: { id: entry._id } });
});

// PATCH /api/journals/:id/favorite
const toggleFavorite = asyncHandler(async (req, res) => {
  const entry = await Journal.findOne(scoped(req, { _id: req.params.id }));
  if (!entry) return fail(res, 'We could not find that entry', 404);

  entry.isFavorite =
    typeof req.body.isFavorite === 'boolean' ? req.body.isFavorite : !entry.isFavorite;
  await entry.save();

  return ok(res, {
    message: entry.isFavorite ? 'Added to favourites' : 'Removed from favourites',
    data: { entry },
  });
});

// POST /api/journals/:id/lock
const lockJournal = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password || !String(password).trim()) {
    return fail(res, 'Please provide a password to lock this entry', 400);
  }

  const entry = await Journal.findOne(scoped(req, { _id: req.params.id })).select('+lockPassword');
  if (!entry) return fail(res, 'We could not find that entry', 404);

  await entry.setLockPassword(String(password).trim());
  await entry.save();

  const obj = entry.toObject();
  delete obj.lockPassword;
  return ok(res, { message: 'Entry locked with password successfully', data: { entry: obj } });
});

// POST /api/journals/:id/unlock
const unlockJournal = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return fail(res, 'Password is required to unlock this entry', 400);
  }

  const entry = await Journal.findOne(scoped(req, { _id: req.params.id })).select('+lockPassword');
  if (!entry) return fail(res, 'We could not find that entry', 404);

  if (!entry.isLocked) {
    const obj = entry.toObject();
    delete obj.lockPassword;
    return ok(res, { message: 'Entry is not locked', data: { entry: obj } });
  }

  const isValid = await entry.matchLockPassword(password);
  if (!isValid) {
    return fail(res, 'Incorrect password. Access denied.', 401);
  }

  const obj = entry.toObject();
  delete obj.lockPassword;
  return ok(res, { message: 'Entry unlocked successfully', data: { entry: obj } });
});

// POST /api/journals/:id/remove-lock
const removeJournalLock = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const entry = await Journal.findOne(scoped(req, { _id: req.params.id })).select('+lockPassword');
  if (!entry) return fail(res, 'We could not find that entry', 404);

  if (entry.isLocked) {
    if (!password) {
      return fail(res, 'Password required to remove lock', 400);
    }
    const isValid = await entry.matchLockPassword(password);
    if (!isValid) {
      return fail(res, 'Incorrect password', 401);
    }
  }

  entry.isLocked = false;
  entry.lockPassword = undefined;
  await entry.save();

  const obj = entry.toObject();
  delete obj.lockPassword;
  return ok(res, { message: 'Lock removed successfully', data: { entry: obj } });
});

// GET /api/journals/on-this-day -> Memories recorded on this calendar day in past years/months
const getOnThisDay = asyncHandler(async (req, res) => {
  const targetDate = req.query.date ? new Date(req.query.date) : new Date();
  const targetMonth = targetDate.getMonth() + 1; // 1-12
  const targetDay = targetDate.getDate(); // 1-31
  const targetYear = targetDate.getFullYear();

  // 1. Match exact month & day from prior years
  const yearlyMatches = await Journal.aggregate([
    {
      $match: {
        userId: req.user._id,
        isDraft: { $ne: true },
        $expr: {
          $and: [
            { $eq: [{ $month: '$date' }, targetMonth] },
            { $eq: [{ $dayOfMonth: '$date' }, targetDay] },
            { $lt: [{ $year: '$date' }, targetYear] },
          ],
        },
      },
    },
    { $sort: { date: -1 } },
  ]);

  let results = [...yearlyMatches];

  // 2. Fallback: if no exact yearly match, find entries on same day of month in prior months
  if (results.length === 0) {
    const monthlyMatches = await Journal.aggregate([
      {
        $match: {
          userId: req.user._id,
          isDraft: { $ne: true },
          $expr: {
            $and: [
              { $eq: [{ $dayOfMonth: '$date' }, targetDay] },
              { $lt: ['$date', targetDate] },
            ],
          },
        },
      },
      { $sort: { date: -1 } },
      { $limit: 6 },
    ]);
    results = [...monthlyMatches];
  }

  // 3. Format entries and calculate relative time label
  const sanitized = results.map((entry) => {
    const entryDate = new Date(entry.date);
    const yearsDiff = targetYear - entryDate.getFullYear();
    const monthsDiff =
      (targetYear - entryDate.getFullYear()) * 12 + (targetDate.getMonth() - entryDate.getMonth());

    let timeAgo = '';
    if (
      yearsDiff >= 1 &&
      entryDate.getMonth() === targetDate.getMonth() &&
      entryDate.getDate() === targetDate.getDate()
    ) {
      timeAgo = `${yearsDiff} ${yearsDiff === 1 ? 'year' : 'years'} ago today`;
    } else if (yearsDiff >= 1) {
      timeAgo = `${yearsDiff} ${yearsDiff === 1 ? 'year' : 'years'} ago`;
    } else if (monthsDiff >= 1) {
      timeAgo = `${monthsDiff} ${monthsDiff === 1 ? 'month' : 'months'} ago`;
    } else {
      timeAgo = 'Past memory';
    }

    const isCapsuleLocked =
      Boolean(entry.isTimeCapsule) && Boolean(entry.unlockDate) && new Date(entry.unlockDate) > new Date();

    if (entry.isLocked) {
      return {
        ...entry,
        content: '🔒 This entry is password protected.',
        imageUrl: '',
        audioUrl: '',
        audioTranscript: '',
        timeAgo,
        isCapsuleLocked,
      };
    }

    if (isCapsuleLocked) {
      const unlockStr = new Date(entry.unlockDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return {
        ...entry,
        content: `⏳ Time Capsule Sealed — Unlocks on ${unlockStr}`,
        imageUrl: '',
        audioUrl: '',
        audioTranscript: '',
        timeAgo,
        isCapsuleLocked: true,
      };
    }

    return { ...entry, timeAgo, isCapsuleLocked: false };
  });

  return ok(res, {
    message: 'On This Day entries fetched successfully',
    data: {
      entries: sanitized,
      date: { month: targetMonth, day: targetDay, year: targetYear },
    },
  });
});

module.exports = {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
  toggleFavorite,
  lockJournal,
  unlockJournal,
  removeJournalLock,
  getStats,
  getTags,
  getOnThisDay,
};

