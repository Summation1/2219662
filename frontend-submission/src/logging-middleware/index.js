import { sendLog } from './utils/api.js';

/**
 * @param {"frontend" | "backend"} stack
 * @param {"debug" | "info" | "warn" | "error" | "fatal"} level
 * @param {"api" | "handler" | "controller" | "db" | "route" | "service" | "repository"} pkg
 * @param {string} message
 */
export const logEvent = async (stack, level, pkg, message) => {
  if (!stack || !level || !pkg || !message) {
    console.error('Missing parameters for logging.');
    return;
  }

  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message,
  };

  await sendLog(payload);
};
