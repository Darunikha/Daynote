const User = require('../models/User');
const Journal = require('../models/Journal');
const { ok, fail, asyncHandler } = require('../utils/response');
const { shape } = require('./authController');

// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return fail(res, 'This account no longer exists', 404);

  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim();
    if (name.length < 2) return fail(res, 'Name must be at least 2 characters', 400);
    user.name = name;
  }
  if (req.body.bio !== undefined) user.bio = String(req.body.bio).slice(0, 160);
  if (req.body.theme !== undefined && ['light', 'dark'].includes(req.body.theme)) {
    user.theme = req.body.theme;
  }
  if (req.body.avatarUrl !== undefined) user.avatarUrl = req.body.avatarUrl;

  await user.save();
  return ok(res, { message: 'Profile updated successfully', data: { user: shape(user) } });
});

// PUT /api/users/password
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return fail(res, 'Please fill in both password fields', 400);
  }
  if (newPassword.length < 6) return fail(res, 'New password must be at least 6 characters', 400);
  if (confirmPassword !== undefined && newPassword !== confirmPassword) {
    return fail(res, 'New passwords do not match', 400);
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    return fail(res, 'Your current password is not correct', 401);
  }

  user.password = newPassword;
  await user.save();
  return ok(res, { message: 'Password updated successfully' });
});

// DELETE /api/users/me -> removes the account and every entry that belongs to it
const deleteAccount = asyncHandler(async (req, res) => {
  await Journal.deleteMany({ userId: req.user._id });
  await User.findByIdAndDelete(req.user._id);
  return ok(res, { message: 'Your account and entries have been deleted' });
});

module.exports = { updateProfile, updatePassword, deleteAccount };
