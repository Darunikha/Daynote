const { fail } = require('../utils/response');

const notFound = (req, res) => fail(res, `Route not found: ${req.originalUrl}`, 404);

/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  // Log the real error server-side; never send a stack trace to the client.
  console.error('[error]', err.message);

  // Mongoose validation
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)[0]?.message || 'Please check the form and try again';
    return fail(res, message, 400);
  }

  // Bad ObjectId
  if (err.name === 'CastError') {
    return fail(res, 'We could not find what you were looking for', 404);
  }

  // Duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return fail(res, `That ${field} is already in use`, 409);
  }

  return fail(res, err.message || 'Something went wrong on our side', err.status || 500);
};

module.exports = { notFound, errorHandler };
