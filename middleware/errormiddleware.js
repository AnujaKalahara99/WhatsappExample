//to overwrire the error handler we pass err (default use variable)
const errorHandler = (err, req, res, next) => {
  const statuscode = res.statuscode ? res.statuscode : 500;

  res.status(statuscode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV == "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
