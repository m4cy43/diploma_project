const errorHandler = (err, req, res, next) => {
  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
  // No next() execution: last function in middleware
};

module.exports = { errorHandler };
