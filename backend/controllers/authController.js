const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { ok, fail, asyncHandler } = require('../utils/response');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

module.exports = { register, login, getMe, shape };
