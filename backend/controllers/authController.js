const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { ok, fail, asyncHandler } = require('../utils/response');
const { isEmailConfigured, sendPasswordResetEmail } = require('../config/email');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/** Hashes a raw reset token the same way before storing or looking it up. */
const hashToken = (raw) => crypto.createHash('sha256').update(raw).digest('hex');

const shape = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  theme: user.theme,
  createdAt: user.createdAt,
});

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const { password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return fail(res, 'Name, email and password are all required', 400);
  }
  if (!EMAIL_RE.test(email)) return fail(res, 'Please enter a valid email address', 400);
  if (password.length < 6) return fail(res, 'Password must be at least 6 characters', 400);
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return fail(res, 'Passwords do not match', 400);
  }

  const exists = await User.findOne({ email });
  if (exists) return fail(res, 'An account with that email already exists', 409);

  const user = await User.create({ name, email, password });

  return ok(res, {
    status: 201,
    message: 'Welcome to Daynote',
    data: { user: shape(user), token: generateToken(user._id) },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password) return fail(res, 'Please enter your email and password', 400);

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return fail(res, 'That email or password is not right', 401);
  }

  return ok(res, {
    message: 'Signed in successfully',
    data: { user: shape(user), token: generateToken(user._id) },
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) =>
  ok(res, { message: 'Current user', data: { user: shape(req.user) } })
);

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return fail(res, 'Please enter a valid email address', 400);
  }

  // Always respond the same way whether or not the account exists, so this
  // endpoint can't be used to discover which emails are registered.
  const genericMessage = "If an account exists for that email, we've sent a reset link.";

  const user = await User.findOne({ email });
  if (!user) return ok(res, { message: genericMessage });

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = hashToken(rawToken);
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save({ validateBeforeSave: false });

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
  const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

  if (isEmailConfigured) {
    await sendPasswordResetEmail(user.email, resetUrl);
    return ok(res, { message: genericMessage });
  }

  // No mail provider set up - hand the link back directly so the flow still
  // works end to end in development, and log it for convenience.
  console.log(`[dev] Password reset link for ${user.email}: ${resetUrl}`);
  return ok(res, {
    message: "Email isn't configured on this server, so here's your reset link instead:",
    data: { resetUrl, emailSent: false },
  });
});

// POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || password.length < 6) {
    return fail(res, 'Password must be at least 6 characters', 400);
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return fail(res, 'Passwords do not match', 400);
  }

  const user = await User.findOne({
    resetPasswordToken: hashToken(token),
    resetPasswordExpires: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    return fail(res, 'This reset link is invalid or has expired. Please request a new one.', 400);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return ok(res, {
    message: 'Your password has been reset. You can now sign in.',
    data: { user: shape(user), token: generateToken(user._id) },
  });
});

module.exports = { register, login, getMe, forgotPassword, resetPassword, shape };
