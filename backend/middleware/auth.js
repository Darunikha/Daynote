const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fail, asyncHandler } = require('../utils/response');

/**
 * Verifies the Bearer token and attaches the current user to req.user.
 * Every journal route sits behind this.
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return fail(res, 'You need to be signed in to do that', 401);
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return fail(res, 'This account no longer exists', 401);
    req.user = user;
    return next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Your session has expired, please sign in again'
        : 'Your session is not valid, please sign in again';
    return fail(res, message, 401);
  }
});

module.exports = { protect };
