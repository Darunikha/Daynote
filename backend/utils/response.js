/** Consistent success envelope: { success, message, data } */
const ok = (res, { message = 'OK', data = null, status = 200 } = {}) =>
  res.status(status).json({ success: true, message, data });

/** Consistent error envelope: { success, message } */
const fail = (res, message = 'Something went wrong', status = 400) =>
  res.status(status).json({ success: false, message });

/** Wraps async controllers so thrown errors reach the error middleware. */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** Small helper used by controllers to throw an error with a status code. */
class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = { ok, fail, asyncHandler, ApiError };
