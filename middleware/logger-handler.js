const logger = require('./logger');

module.exports = loggerHandler;

function loggerHandler(req, res, next) {
  logger.info(req.originalUrl);
  next();
}
