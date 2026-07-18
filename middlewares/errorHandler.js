const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(err.message || "Error interno del servidor", {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json({
    message: err.message || "Error interno del servidor",
  });
};

module.exports = errorHandler;
