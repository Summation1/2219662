// index.js

const { sendLog } = require('./utils/api');

/**
 * Logs an event to the AffordMed evaluation service.
 * @param {"frontend" | "backend"} stack - Which part of the app the log is from.
 * @param {"debug" | "info" | "warn" | "error" | "fatal"} level - Severity level.
 * @param {"api" | "handler" | "controller" | "db" | "route" | "service" | "repository"} pkg - Logical module.
 * @param {string} message - Log message.
 */
const Log = async (stack, level, pkg, message) => {
  if (!stack || !level || !pkg || !message) {
    console.error('Missing parameters for logging.');
    return;
  }

  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message: message
  };

  await sendLog(payload);
};

module.exports = { Log };
